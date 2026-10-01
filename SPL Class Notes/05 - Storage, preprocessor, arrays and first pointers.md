---
tags: [spl, c-programming, arrays, pointers, storage-classes]
---

# 05 — Storage, preprocessor, arrays and first pointers

## `auto`, `static`, and `extern`

An automatic local variable is created when its block is entered and has no retained value after that block ends. A static local is initialized once and keeps its value between calls:

```c
int running_sum(int a, int b) {
    static int sum = 0;
    sum += a + b;
    return sum;
}

// running_sum(1,3) -> 4; then running_sum(5,6) -> 15
```

If `sum` were an ordinary `int sum = 0;` inside the function, the second answer would be 11.

> [!tip] Initialization and assignment differ
> `static int sum = 0;` initializes once. Writing `static int sum;` followed by `sum = 0;` resets the value every time execution reaches that assignment.

`extern int value;` declares a variable whose definition can be provided in another source file. The declaration allows code to use that same variable.

## `#include`, `#define`, and compilation

Compare `#define PI 3.14159` with `const double pi = 3.14159;`. A macro is substituted by the preprocessor; a `const` object has a C type and normal scope rules. A macro directive has no terminating semicolon.

Use `#include <stdio.h>` or `#include <math.h>` for standard headers. Use `#include "number_theory.h"` for a local header.

> [!important] Remember
> `#define PI 2 * acos(0.0)` is an expression macro, not a compile-time constant in every C context. If used, put parentheses around it: `#define PI (2.0 * acos(0.0))`. For most code, a typed constant is clearer.

## Number bases

Base 5 uses the digits `0, 1, 2, 3, 4`. A positional number in base `b` has place values `1, b, b², ...`; every digit must be smaller than `b`. For example, `(3142)₅ = 3×5³ + 1×5² + 4×5 + 2 = 422` in decimal. In base 5, `4 + 1` writes `0` and carries `1` to the next place.

## Functions in separate source files

To call an `is_p(int n)` prime-checking function from `test.c` and implement it in `secondary.c`, put its declaration in a shared header and compile/link both `.c` files together:

```c
/* number_theory.h */
int is_p(int n);

/* secondary.c */
#include "number_theory.h"
int is_p(int n) {
    if (n < 2) return 0;
    for (int d = 2; d <= n / d; ++d)
        if (n % d == 0) return 0;
    return 1;
}

/* test.c */
#include "number_theory.h"
int main(void) {
    int answer = is_p(17);
    return answer ? 0 : 1;
}
```

For functions, `extern` is implicit on an ordinary file-scope prototype. The function's **definition** supplies its body in another `.c` file.

## Arrays and matrix practice

`int arr[5]` contains five integers. `int matrix[5][5]` contains five rows of five integers. `int cube[2][4][5]` contains two layers, each with four rows of five integers. Indices start at 0.

For a matrix, the outer loop moves through rows and the inner loop moves through columns. To add two matrices of the same dimensions, add corresponding elements:

```c
int a[3][3] = {{5, 1, 2}, {6, 1, 5}, {1, 2, 3}};
int b[3][3] = {{6, 2, 1}, {5, 2, 0}, {2, 3, 1}};
int c[3][3];
for (int row = 0; row < 3; ++row) {
    for (int col = 0; col < 3; ++col) {
        c[row][col] = a[row][col] + b[row][col];
    }
}
```

### String length

Count characters until the null terminator. The standard-library function is `strlen` from `<string.h>`.

```c
#include <stddef.h>

size_t length(const char s[]) {
    size_t n = 0;
    while (s[n] != '\0') ++n;
    return n;
}
```

## First pointer model

A **pointer** is a variable whose value is an address. In `int *p = &x;`, `&x` takes the address of `x`, and `*p` accesses the `int` stored there.

```c
int x = 10;
int *p = &x;
printf("%d", *p);  // 10
*p = 20;            // x is now 20
```

If `x` is stored at address 100, `p` holds 100 and `*p` gives 20 after the assignment. The pointer itself occupies a separate location. Actual addresses and type sizes depend on the machine and compiler.

Next: [[06 - Pointer fundamentals and strings]].
