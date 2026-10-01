---
tags: [spl, c-programming, pointers, multidimensional-arrays]
---

# 08 — Pointer arithmetic and multidimensional arrays

## Pointer arithmetic review

`sizeof(p)` measures the pointer object; `sizeof(*p)` measures the pointed-to type. Common systems use 4-byte pointers in a 32-bit environment or 8-byte pointers in a 64-bit environment. The actual sizes are implementation-dependent. `sizeof(char)` is always 1 C byte.

For a pointer into an array, adding 1 moves to the **next element**. Subtracting two pointers into the same array gives an element distance, with type `ptrdiff_t` (`<stddef.h>`). Ordinary C does not define adding two pointers or multiplying them.

```c
int a[] = {10, 20, 30};
int *p = &a[0];
++p;       // now points to a[1]
(*p)++;    // changes a[1] from 20 to 21
```

| Expression | Effect |
|---|---|
| `(*p)++` | Increment the pointed-to value |
| `*p++` | Dereference the old pointer and advance `p` |
| `*++p` | Advance `p`, then dereference it |
| `++*p` | Increment the pointed-to value; produce the new value |

Postfix `++` binds more tightly than unary `*`, so `*p++` means `*(p++)`. Pointer movement must stay within the array or at its one-past position; the one-past pointer must not be dereferenced.

The `*` symbol has two pointer-related roles: in a declaration, `int *p` declares a pointer; in an expression, `*p` dereferences it. Between numeric operands, `*` is multiplication.

### Inspecting an object byte by byte

An `unsigned char *` can inspect the bytes of an object's representation:

```c
#include <stdio.h>

void show_bytes(void) {
    unsigned long x = 0x41424344UL;
    const unsigned char *bytes = (const unsigned char *)&x;
    for (size_t i = 0; i < sizeof x; ++i)
        printf("%02X ", (unsigned)bytes[i]);
}
```

The byte order and number of bytes depend on the system.

## A 2D array is contiguous rows

An array such as `int arr[5][2]` contains 5 rows of 2 `int` elements. It is a contiguous block, laid out row by row. The total element count is `5 × 2 = 10`; its size in bytes is `sizeof arr`.

```c
int arr[5][2];
sizeof arr;        // bytes in all 10 ints
sizeof arr[0];     // bytes in one row of 2 ints
sizeof arr[0][0];  // bytes in one int
```

The array name `arr` is **not a pointer variable**. In most expressions it converts to a pointer to its first row, with type `int (*)[2]`. `arr[0]` is the first row and usually converts to `int *` when used in an expression. The addresses `arr`, `arr[0]`, and `&arr[0][0]` can have the same numeric location, but their types and pointer steps differ.

## Address calculation

For an array with `C` columns, element `arr[row][col]` lies `row × C + col` elements after `arr[0][0]`:

`address(arr[row][col]) = base + (row × C + col) × sizeof(element)`.

For `int arr[5][4]`, assume the base address is 100 and each `int` occupies 4 bytes:

| Element | Calculation | Address |
|---|---|---|
| `arr[0][3]` | `100 + (0×4+3)×4` | 112 |
| `arr[1][3]` | `100 + (1×4+3)×4` | 128 |
| `arr[3][2]` | `100 + (3×4+2)×4` | 156 |
| `arr[4][0]` | `100 + (4×4+0)×4` | 164 |

If `arr[4][2]` is instead known to be at address 1000, work backward: the base is `1000 − (4×4+2)×4 = 928`. Then `arr[3][3]` is at `928 + (3×4+3)×4 = 988`.

### Three and four dimensions

For dimensions `[D][R][C]`, the element offset of `[d][r][c]` is:

`d × R × C + r × C + c`.

For `int arr[5][4][6]`, with base 100 and 4-byte elements, `[3][2][4]` is at `100 + (3×4×6 + 2×6 + 4)×4 = 452`.

For dimensions `[A][B][C][D]`, the element offset of `[i][j][k][l]` is:

`i × B × C × D + j × C × D + k × D + l`.

Multiply the element offset by the element size and add the base address.

> [!note] About the example addresses
> These are arithmetic exercises. Actual addresses depend on layout, alignment, type size, and the running program.

Next: [[09 - Passing multidimensional arrays]].
