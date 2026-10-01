---
tags: [spl, c-programming, strings, storage-classes]
---

# 03 — Library functions, strings and storage

## Return types and library functions

A function's return type tells the compiler what value a call produces. The functions `sin`, `pow`, and `asin` from `<math.h>` return `double`. Angles for `sin` are in radians; `asin` returns an angle in radians.

```c
#include <math.h>
double x = sin(0.5);
double y = pow(2.0, 3.0);
```

To calculate an integer power, multiply `base` repeatedly:

```c
long long integer_power(long long base, unsigned exponent) {
    long long answer = 1;
    while (exponent-- > 0) answer *= base;
    return answer;
}
```

This handles nonnegative integer exponents and may overflow for large answers. Its loop takes O(exponent) time.

## String manipulation

A C string is a sequence of characters ending in `\0`. Include `<string.h>` to use `strcpy(destination, source)` and `strcmp(s1, s2)`.

```c
char source[] = "abcd";
char destination[50];
strcpy(destination, source);  // destination becomes "abcd"

int comparison = strcmp("abcd", "add");
// negative: first string is lexicographically smaller
```

`strcpy` needs enough destination space, including the final `\0`.

| Result of `strcmp(s1, s2)` | Meaning |
|---|---|
| Negative | `s1` comes before `s2` lexicographically |
| Zero | The strings are equal |
| Positive | `s1` comes after `s2` lexicographically |

Comparison stops at the first different character. If one string is a prefix of the other, the shorter string comes first. Use the **sign** of the result; an exact value such as `-2` is not guaranteed.

### Copying a block of memory

`memcpy(destination, source, byte_count)` copies a specified number of bytes. It does not stop at `\0`, so it can copy arrays as well as strings. Include `<string.h>`, ensure the destination is large enough, and use nonoverlapping memory regions.

```c
int original[3] = {1, 2, 3};
int copy[3];
memcpy(copy, original, sizeof original);
```

## Local/global variables and storage classes

Four basic storage-class keywords are `auto`, `extern`, `static`, and `register`. A local variable declared inside a function normally has automatic storage duration. A file-scope variable exists for the whole program and can be shared by functions in that file.

- **Scope:** where a name can be used.
- **Lifetime:** how long the object exists.
- **Linkage:** whether declarations in different places refer to the same object or function.

`register` is the older hint that a local variable may be kept in a CPU register; modern compilers choose storage themselves. C does not allow taking the address of an object declared `register`.

```c
int count = 5;              // file scope

void example(void) {
    int count = 3;          // local variable shadows the file-scope count
    printf("%d", count);     // prints 3
}
```

`extern` can declare a variable defined elsewhere, often in another source file. `static` on a local variable preserves its value between calls; `static` at file scope limits linkage to that source file.

Global and static objects are initialized to zero when no explicit initializer is given. An uninitialized automatic local variable has an indeterminate value; assign a value before reading it.

## Preprocessor and array sizes

The C preprocessor handles directives such as `#include` and `#define` before compilation. A macro like `#define N 100` gives a symbolic size; it does not create a variable.

```c
#define N 10
int values[N];            // ten zero-initialized integers at file scope
int other[5 * 3 + 2];      // valid constant expression: 17 elements
int selected[6] = {[5] = 6};  // {0, 0, 0, 0, 0, 6}
```

> [!important] Array bounds
> An array bound at file scope must be an integer constant expression. Arithmetic on constants, such as `5 * 3 + 2`, is valid. A size determined at runtime requires a local variable-length array where supported, or dynamic allocation.

Large automatic local arrays may exhaust stack space, while large global arrays last for the whole program. Choose a size and storage duration appropriate to the data:

```c
#include <stdio.h>

int a[1000000]; // OK: Allocated in the BSS/Data segment (global)

int main(void) {
    // int b[1000000]; // ERROR: Likely crashes due to Stack Overflow!
    return 0;
}
```

> [!note] Stack versus Global (BSS/Data) Memory Limits
> Automatic local variables inside functions are placed on the **Call Stack**, which has a strictly limited default size (commonly 1 MB to 8 MB depending on the operating system). Declaring an array like `int b[1000000];` requires nearly 4 MB of contiguous stack memory and will frequently trigger a **Stack Overflow**.
> In contrast, declaring `int a[1000000];` at **global / file scope** allocates it in the **Data/BSS segment**, which is bounded only by available system RAM and virtual address space.

Next: [[04 - Recursion and dynamic programming]].
