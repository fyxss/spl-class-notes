---
tags: [spl, c-programming, file-io, lab]
---

# 18 — Binary files, positioning and record access

Date: 13.09.2026. SPL lab and quiz on structures and files.

## File-system classification

```text
File system
├─ Stream oriented
│  ├─ Formatted: fscanf, fprintf
│  └─ Unformatted blocks: fread, fwrite
└─ System oriented
```

Formatted I/O converts values to or from text. Block I/O transfers chunks of bytes without a format string; the filename extension alone does not select the mode.

## `fwrite` and `fread`

```c
fwrite(source, item_size, item_count, stream);
fread(destination, item_size, item_count, stream);
```

Both return the number of **complete items** transferred, not necessarily the number of bytes.

```c
int arr[50] = {0};

// Two ways to write the entire array:
fwrite(arr, sizeof arr, 1, pt);                  // one whole-array item
fwrite(arr, sizeof arr[0], 50, pt);              // fifty integer items
```

Execute one form, not both, to write a single copy. If an integer is 4 bytes, the total is 200 bytes. `sizeof arr / sizeof arr[0]` gives the count when `arr` is an actual array in that scope.

```c
#include <stdio.h>

int main(void) {
    int arr[50] = {0}, arr2[50];
    FILE *pt = fopen("test.bin", "wb+");
    if (pt == NULL) return 1;

    if (fwrite(arr, sizeof arr[0], 50, pt) != 50) {
        fclose(pt);
        return 1;
    }
    rewind(pt);
    if (fread(arr2, sizeof arr2[0], 50, pt) != 50) {
        fclose(pt);
        return 1;
    }

    fclose(pt);
    return 0;
}
```

`rewind` moves back to the beginning before reading the values just written. Use `"rb+"` when an existing binary file must be retained. Include `b` in the mode for binary I/O on Windows.

To write one initialized integer:

```c
int a = 5;
fwrite(&a, sizeof a, 1, pt);
```

## File position: `fseek`, `ftell`, and `rewind`

Reading and writing advance the stream's position. Use a seek to move it:

```c
fseek(pt, offset, whence);
```

| Origin | Position measured from |
|---|---|
| `SEEK_SET` | Beginning |
| `SEEK_CUR` | Current position |
| `SEEK_END` | End |

For a binary stream, the offset is measured in bytes. `fseek` returns 0 on success.

```c
fseek(pt, 4L, SEEK_SET);  // byte offset 4 from the beginning
long position = ftell(pt);
fseek(pt, 0L, SEEK_SET);  // return to the beginning
rewind(pt);              // also return to the beginning
```

`ftell` returns `long`, not `int`; `-1L` indicates failure. `rewind` also clears the stream's error and EOF indicators. For text files, do not assume arbitrary byte offsets behave like binary offsets.

## Lab task: person report

Task:

- Read `people.txt` in `"r"` mode.
- Write `report.txt` in `"w"` mode.
- Input records contain ID, name, age, city, and salary, for example `101 Rahim 28 Dhaka 45000`.
- Report the total number of persons, average age, and average salary.

Read each complete record, accumulate the age and salary totals, and divide by the record count for the averages. Check that the count is nonzero before dividing.

## Relative and absolute paths

An **absolute path** starts from the drive/root:

```c
"C:/Users/Rakib/Documents/people.txt"
```

A **relative path** starts from the program's current working directory:

```c
"people.txt"                // current directory
"../../../Documents/people.txt" // move up three levels, then into Documents
```

Each `..` means one parent directory. Relative paths are resolved from the working directory, which need not be the directory containing the source file.

## Assignment: store and access structure records

Store a sequence of people, each with an ID and name, in a file. Each record has the same size, so record `ind` begins at `ind * sizeof(record)`.

```c
#include <stdio.h>
#include <string.h>

typedef struct people {
    int id;
    char name[50];
} people;

FILE *q;
int cur = 0;  // next record index; start at 0 for a newly created file

void push(int id, const char *s) {
    people p = {0};
    if (q == NULL || strlen(s) >= sizeof p.name) return;
    p.id = id;
    strcpy(p.name, s);

    if (fseek(q, (long)cur * (long)sizeof p, SEEK_SET) != 0) return;
    if (fwrite(&p, sizeof p, 1, q) == 1) ++cur;
}

void print(int ind) {
    if (q == NULL || ind < 0 || ind >= cur) return;
    people p;
    if (fseek(q, (long)ind * (long)sizeof p, SEEK_SET) != 0) return;
    if (fread(&p, sizeof p, 1, q) == 1)
        printf("%d %s\n", p.id, p.name);
}
```

Open `q` in `"wb+"` for a new file, check it, call `push(5, "Rahim")`, then `print(0)`, and close it. `push` explicitly seeks to the next record so it still appends after a `print` has moved the stream position.

> [!note] Writing structure records
> `fwrite` needs `&p`, not the structure value `p`. The record index is an integer, so compare `cur` with an integer limit if needed, not `NULL`. `sizeof` uses the whole structure, including padding. This raw binary representation is intended for reading with the same structure layout and environment.

Next: [[19 - Stream redirection, endianness and register]].
