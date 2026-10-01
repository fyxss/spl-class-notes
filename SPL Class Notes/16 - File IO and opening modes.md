---
tags: [spl, c-programming, file-io]
---

# 16 — File I/O and opening modes

Date: 08.09.2026.

## Buffer and storage

A **buffer** is temporary memory used between the program and an input/output destination. Output from `printf` may first enter a buffer before being sent to the console. Buffering reduces frequent interactions with the destination and keeps the output sequence.

```text
program -> output buffer -> console or file
```

- **Primary memory:** RAM, used while the program runs.
- **Secondary storage:** disk and similar storage, where a file can remain after the program ends.

**File I/O** reads input from a file or writes output to a file.

## File pointer and opening a file

Include `<stdio.h>` for `FILE`, `fopen`, `fscanf`, `fprintf`, and `fclose`.

```c
FILE *ptvar;
ptvar = fopen("test.txt", "r");
```

`FILE` is the library's stream type. `FILE *` refers to the stream's bookkeeping, including buffering and position information; it is not a pointer directly into disk bytes. Declaring it alone does not open a file.

General form:

```c
fopen(file_name, mode)
```

`fopen` returns a stream pointer on success or `NULL` on failure. Check before using it:

```c
if (ptvar == NULL) {
    printf("File cannot be opened\n");
    return 1;  // inside main
}
```

## Opening modes

| Mode | Operations | Existing file | Missing file |
|---|---|---|---|
| `"r"` | Read | Keep contents | Fail |
| `"w"` | Write | Truncate contents | Create |
| `"a"` | Append | Keep contents; write at end | Create |
| `"r+"` | Read and write | Keep contents | Fail |
| `"w+"` | Read and write | Truncate contents | Create |
| `"a+"` | Read and append | Keep contents; writes go to end | Create |

Any mode can also fail for other reasons, such as access permissions. Use `b` for binary files, for example `"rb"`, `"wb"`, and `"rb+"`.

## Formatted input and output

```c
fscanf(ptvar, "%d", &n);
fprintf(ptvar, "sum=%d\n", sum);
fclose(ptvar);
```

`fscanf` and `fprintf` resemble `scanf` and `printf`, with the file stream as the first argument. Close a stream when finished; closing also flushes buffered output.

| Function | Reads from / writes to |
|---|---|
| `scanf` | Standard input |
| `printf` | Standard output |
| `fscanf` / `fprintf` | A `FILE *` stream |
| `sscanf` / `sprintf` | A character string buffer |

`sscanf` reads formatted values from a string, while `fscanf` reads them from a stream.

## Read numbers and write their sum

The file contains a count followed by that many numbers:

```text
5
2 3 5 6 7
```

```c
#include <stdio.h>

int main(void) {
    FILE *ptvar = fopen("test.txt", "r+");
    if (ptvar == NULL) {
        printf("File cannot be opened\n");
        return 1;
    }

    int n, sum = 0;
    if (fscanf(ptvar, "%d", &n) != 1 || n < 0) {
        fclose(ptvar);
        return 1;
    }
    for (int i = 0; i < n; ++i) {
        int x;
        if (fscanf(ptvar, "%d", &x) != 1) {
            fclose(ptvar);
            return 1;
        }
        sum += x;
    }

    if (fseek(ptvar, 0, SEEK_END) != 0) {
        fclose(ptvar);
        return 1;
    }
    fprintf(ptvar, "\nsum=%d\n", sum);
    fclose(ptvar);
    return 0;
}
```

Here the sum is 23.

> [!note] Switching from reading to writing
> On an update stream such as `"r+"`, a positioning operation is needed between input and output unless input has encountered EOF. `fseek` places the result at the end of the file and allows the switch to writing. Initialize `sum` before adding the numbers.

Next: [[17 - Linked list deletion and pointer parameters]].
