---
tags: [spl, c-programming, pointers, dynamic-memory]
---

# 07 — Dynamic memory allocation

## Why allocate at runtime?

**Dynamic memory allocation** requests storage while a program runs. It is useful when the required size is determined from input or changes during execution.

| Memory region | Typical use | Lifetime |
|---|---|---|
| Stack | Active function calls and automatic local variables | Until the call or block ends |
| Heap | Dynamically allocated blocks | Until released with `free` or replaced by `realloc` |
| Global/static | Objects with static storage duration | Entire program execution |
| Code/text | Compiled program instructions | Entire program execution |

These regions describe a typical implementation. Deep recursion or large automatic arrays can exhaust available stack space.

`malloc`, `calloc`, and `realloc` request or resize storage; `memset` fills an **existing** byte region. Use `<stdlib.h>` for allocation functions and `<string.h>` for `memset`.

| Operation | Purpose | Important detail |
|---|---|---|
| `malloc(bytes)` | request a raw block | bytes are uninitialized |
| `calloc(count, size)` | request count items | allocated bytes are zeroed |
| `realloc(ptr, bytes)` | resize a block | may move it; old pointer remains valid if it fails |
| `memset(ptr, byte, bytes)` | fill an existing block | works byte by byte; does not allocate |
| `free(ptr)` | release allocated block | do not use that block afterward |

## `malloc`, `calloc`, and `memset`

For `n` integers, request `n * sizeof(int)` bytes. Writing `sizeof *arr` lets the element size follow the pointer's type:

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t n = 10;
    int *arr = malloc(n * sizeof *arr);
    if (arr == NULL) {
        fprintf(stderr, "Out of memory\n");
        return 1;
    }

    for (size_t i = 0; i < n; ++i) arr[i] = 0;

    free(arr);
    arr = NULL;
    return 0;
}
```

`calloc(n, sizeof *arr)` requests the same number of bytes and zeroes them. The number of bytes passed to `malloc` is computed from the element count and element size. `memset(arr, 0, n * sizeof *arr)` fills every byte with zero; using `memset(..., 1, ...)` does **not** set each `int` to 1.

## Safe `realloc` pattern

For a positive requested size, the block may stay at the same address, move to a new address, or fail to resize. Keep the original pointer until success:

```c
int *tmp = realloc(arr, new_count * sizeof *arr);
if (tmp != NULL) {
    arr = tmp;
} else {
    /* arr still points to the old block */
}
```

After success, use the returned pointer and rebuild any pointers into the resized block. Existing elements are preserved up to the smaller of the old and new sizes; newly added bytes are uninitialized. The program must eventually `free(arr)` once.

## Which address may a function return?

The pointed-to object must still exist after the function returns. An automatic local object no longer exists after return. Valid choices include an object supplied by the caller, a static object, or a newly allocated heap block.

```c
int *make_one(void) {
    int *p = malloc(sizeof *p);
    if (p != NULL) *p = 1;
    return p;               // caller must free it
}
```

> [!important] Releasing memory
> Free each allocated block exactly once when it is no longer needed. Do not free an automatic array, dereference a freed pointer, or lose the only pointer to an allocated block. `free(NULL)` is allowed.

## Matrix multiplication

To multiply an `R × K` matrix by a `K × C` matrix, pair each row of the first matrix with each column of the second:

$$c_{ij} = \sum_{k=0}^{K-1} a_{ik}b_{kj}$$

For `a = {{1, 2}, {3, 4}}` and `b = {{5, 6}, {7, 8}}`:

```text
c[0][0] = 1×5 + 2×7 = 19
c[0][1] = 1×6 + 2×8 = 22
c[1][0] = 3×5 + 4×7 = 43
c[1][1] = 3×6 + 4×8 = 50
```

```c
int a[2][2] = {{1, 2}, {3, 4}};
int b[2][2] = {{5, 6}, {7, 8}};
int c[2][2];

for (int i = 0; i < 2; ++i) {
    for (int j = 0; j < 2; ++j) {
        c[i][j] = 0;
        for (int k = 0; k < 2; ++k)
            c[i][j] += a[i][k] * b[k][j];
    }
}
```

For square `n × n` matrices, these three loops take O(n³) time.

Next: [[08 - Pointer arithmetic and multidimensional arrays]].
