---
tags: [spl, c-programming, dynamic-memory, multidimensional-arrays, strings]
---

# 10 — Dynamic arrays and strings

## Array decay revisited

**Array decay** is the usual conversion of an array expression to a pointer to its first element, especially when passing arrays to functions. The conversion does not turn the actual array object into a pointer, and information about its overall length is not carried in a plain pointer parameter.

For `int a[3][5]`, `a` converts to a pointer to its first **row** (`int (*)[5]`). For `int *p[3]`, `p` converts to a pointer to its first **pointer element** (`int **`). These two declarations have different layouts and are not interchangeable.

## Dynamic 2D array: array of row pointers

Allocate a pointer array, then separately allocate each row. This also allows rows to have different lengths. The following program creates three rows of five integers:

```c
#include <stdlib.h>

int main(void) {
    size_t rows = 3, cols = 5;
    int **a = malloc(rows * sizeof *a);
    if (a == NULL) return 1;

    for (size_t i = 0; i < rows; ++i) {
        a[i] = malloc(cols * sizeof *a[i]);
        if (a[i] == NULL) {
            for (size_t j = 0; j < i; ++j) free(a[j]);
            free(a);
            return 1;
        }
    }

    a[1][2] = 7;

    for (size_t i = 0; i < rows; ++i) free(a[i]);
    free(a);
    return 0;
}
```

Each row requires `cols * sizeof(int)` bytes; the outer block requires `rows * sizeof(int *)` bytes. A **jagged array** uses a different length for each row, such as 3, 5, and 4. Store those lengths separately so that each row can be traversed correctly.

> [!important] Different memory layouts
> `int **` describes pointer-to-pointer storage. It does **not** describe a contiguous `int [rows][cols]` block. Free each separately allocated row before freeing the outer pointer array.

## Dynamic 3D array

For `int ***`, allocate the first-level pointer array, then a pointer array for each plane, then integer arrays for each row:

```text
int ***a
  └─ a[d]       → array of row pointers (int **)
       └─ a[d][r]    → array of integers (int *)
            └─ a[d][r][c] → one integer
```

For positive dimensions `depth`, `rows`, and `cols`, these functions allocate and release that layout:

```c
#include <stdlib.h>

void free_volume(int ***a, int depth, int rows) {
    if (a == NULL) return;
    for (int d = 0; d < depth; ++d) {
        if (a[d] != NULL) {
            for (int r = 0; r < rows; ++r) free(a[d][r]);
            free(a[d]);
        }
    }
    free(a);
}

int ***make_volume(int depth, int rows, int cols) {
    int ***a = malloc(depth * sizeof *a);
    if (a == NULL) return NULL;
    for (int d = 0; d < depth; ++d) a[d] = NULL;

    for (int d = 0; d < depth; ++d) {
        a[d] = malloc(rows * sizeof *a[d]);
        if (a[d] == NULL) {
            free_volume(a, depth, rows);
            return NULL;
        }
        for (int r = 0; r < rows; ++r) a[d][r] = NULL;

        for (int r = 0; r < rows; ++r) {
            a[d][r] = calloc(cols, sizeof *a[d][r]);
            if (a[d][r] == NULL) {
                free_volume(a, depth, rows);
                return NULL;
            }
        }
    }
    return a;
}
```

`make_volume(4, 3, 5)` creates four planes, each with three rows of five zero-initialized integers. Check the returned pointer before use, and later call `free_volume(a, 4, 3)`.

### Filling a matrix with random digits

Include `<stdlib.h>` and `<time.h>`. Seed once at program startup with `srand((unsigned)time(NULL))`; use `rand() % 10` to generate sample values from 0 to 9:

```c
srand((unsigned)time(NULL));
for (int i = 0; i < rows; ++i)
    for (int j = 0; j < cols; ++j)
        a[i][j] = rand() % 10;
```

## Array of strings

An array of string pointers can be passed to a function:

```c
#include <stdio.h>

void print_strings(const char *strings[], int count) {
    for (int i = 0; i < count; ++i)
        printf("%s\n", strings[i]);
}

int main(void) {
    const char *words[] = {"Good", "Nice"};
    print_strings(words, 2);
    return 0;
}
```

The type `char *str[10]` is an array of 10 character pointers. Each element can point to a string. Use `const char *` for pointers to string literals, since literals must not be modified.

### Dynamically allocated string buffers

This example allocates seven buffers. Each holds up to four characters plus `\0`:

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const int count = 7;
    char **strings = malloc(count * sizeof *strings);
    if (strings == NULL) return 1;

    int made = 0;
    while (made < count) {
        strings[made] = malloc(5 * sizeof *strings[made]);
        if (strings[made] == NULL) break;
        ++made;
    }

    int status = made == count ? 0 : 1;
    if (status == 0) {
        for (int i = 0; i < count; ++i) {
            if (scanf("%4s", strings[i]) != 1) {
                status = 1;
                break;
            }
            printf("%s\n", strings[i]);
        }
    }

    for (int i = 0; i < made; ++i) free(strings[i]);
    free(strings);
    return status;
}
```

`%s` reads a word up to whitespace. The width `4` prevents writing more than four characters, leaving space for the null terminator. Input words should be at most four characters here; a longer word leaves unread characters in the input stream.

Next: [[11 - Function pointers and review]].
