---
tags: [spl, c-programming, function-pointers, review]
---

# 11 — Function pointers and review

## Matrix smoothing: average of nine cells

For each interior cell, calculate the average of the cell and its eight neighbors. The offsets `dr` and `dc` identify the surrounding positions:

```text
(-1,-1)  (-1,0)  (-1,+1)
( 0,-1)  center  ( 0,+1)
(+1,-1)  (+1,0)  (+1,+1)
```

Store the result in a separate matrix so later calculations still use the original input values. Copy border cells unchanged because they do not have eight neighbors.

```c
void smooth(int height, int width,
            int a[height][width], int result[height][width]) {
    int dr[8] = {-1, -1, -1, 0, 0, 1, 1, 1};
    int dc[8] = {-1,  0,  1,-1, 1,-1, 0, 1};

    for (int i = 0; i < height; ++i)
        for (int j = 0; j < width; ++j)
            result[i][j] = a[i][j];

    for (int i = 1; i < height - 1; ++i) {
        for (int j = 1; j < width - 1; ++j) {
            int sum = a[i][j];
            for (int k = 0; k < 8; ++k)
                sum += a[i + dr[k]][j + dc[k]];
            result[i][j] = sum / 9;
        }
    }
}
```

For a 3×3 input containing the numbers 1 through 9, the center becomes `(1+2+...+9)/9 = 5`. Integer division discards the fractional part. Time is O(height × width), and the result matrix occupies O(height × width) space.

## Functions have addresses

A function has a return type, name, parameter list, and body. A **function pointer** stores the address of a function with a matching return type and parameter list:

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

int main(void) {
    int (*operation)(int, int) = add;
    printf("%d\n", operation(5, 6));  // 11
    operation = multiply;
    printf("%d\n", operation(5, 6));  // 30
    return 0;
}
```

`add` and `&add` can both initialize a matching function pointer. The pointer call `operation(5,6)` and explicit `(*operation)(5,6)` are equivalent. The pointed-to function's return type and parameter types must match the pointer type.

### Passing a function as an argument

A function can receive a function pointer and call the selected operation:

```c
int calculate(int (*operation)(int, int), int a, int b) {
    return operation(a, b);
}

// Inside main, using the functions above:
// int sum = calculate(add, 5, 6);          // 11
// int product = calculate(multiply, 5, 6); // 30
```

## Pointer review

Key distinctions:

- `sizeof` gives a size in bytes and can be evaluated at compile time for a fixed type; a variable-length array may require runtime evaluation.
- `int *p[5]` is an array of pointers; `int (*p)[5]` is a pointer to an array.
- `*p++` means `*(p++)`, while `(*p)++` increments the pointed-to value.
- A function pointer's parameter and return types must match the function assigned to it.
- `const int *p` prevents modifying the `int` through `p`; `int *const p` prevents changing `p` after initialization.

## Concatenating two arrays

Place all elements of `first` before all elements of `second` in a third array. Write the second array starting at destination index `n1`:

```c
int first[] = {3, 5, 9, 13, 15};
int second[] = {1, 2, 8, 16, 7, 15, 14, 16, 17};
size_t n1 = sizeof first / sizeof first[0];
size_t n2 = sizeof second / sizeof second[0];
int joined[sizeof first / sizeof first[0]
         + sizeof second / sizeof second[0]];

for (size_t i = 0; i < n1; ++i) joined[i] = first[i];
for (size_t i = 0; i < n2; ++i) joined[n1 + i] = second[i];
```

Here `sizeof` works because `first` and `second` are actual arrays in this scope. Inside a function parameter such as `int first[]`, it would see a pointer instead, so lengths must be passed separately.

Next: [[12 - Structures and typedef]].
