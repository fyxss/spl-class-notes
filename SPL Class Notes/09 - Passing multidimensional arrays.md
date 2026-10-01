---
tags: [spl, c-programming, pointers, multidimensional-arrays]
---

# 09 — Passing multidimensional arrays

## `arr`, `arr[0]`, and `&arr`

For `int arr[5][2]`:

| Expression | Meaning in most expressions | Type after conversion |
|---|---|---|
| `arr` | first row | `int (*)[2]` |
| `arr[0]` | first element of first row | `int *` |
| `&arr` | address of entire 5×2 array | `int (*)[5][2]` |
| `arr + 1` | address of second row | `int (*)[2]` |
| `arr[0] + 1` | address of second `int` in first row | `int *` |

Thus `*(arr[0] + 1)` is `arr[0][1]`. `arr + 1` skips a whole row. The array object cannot be reassigned like a pointer variable.

```c
arr[i][j] == *(*(arr + i) + j)
```

First select row `i` with `*(arr+i)`, then move `j` integers along that row and dereference.

## Passing a 2D array to a function

The inner dimension must be known for the usual typed parameter, because the compiler needs the row width for `a[i][j]`:

```c
void print_matrix(int rows, int cols, int a[rows][cols]) {
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j)
            printf("%d ", a[i][j]);
        putchar('\n');
    }
}
```

For a fixed 3-column matrix, `void print(int arr[][3], int rows)` is equivalent as a parameter declaration to `void print(int (*arr)[3], int rows)`. The first dimension may be omitted in the parameter, but the later dimension cannot be omitted in this form.

A flat `int *` parameter is a different type from `int (*)[3]`. When matrix data is stored in a **single one-dimensional array** of `rows * cols` integers, access it with `flat[i * cols + j]`.

> [!important] Match the row width
> The column count in a matrix parameter must describe the actual row width. For a 3-column matrix holding `1,2,3 / 4,5,6 / 7,8,9`, the first two columns of the first two rows are `1,2 / 4,5`. Treating its rows as two elements wide would use the wrong offsets.

The variable-dimension examples use C variable-length array parameter syntax; they require a compiler that supports it. Declare the dimension parameters before using them in an array parameter.

## Passing a 3D array

For a fixed `[D][R][C]` array, the parameter keeps the sizes of the inner dimensions:

```c
void visit3d(int depth, int rows, int cols,
             int a[depth][rows][cols]) {
    for (int d = 0; d < depth; ++d)
        for (int r = 0; r < rows; ++r)
            for (int c = 0; c < cols; ++c)
                printf("%d\n", a[d][r][c]);
}
```

As a parameter, `a` is a pointer to a 2D slice: `int (*)[rows][cols]`. The equivalent explicit pointer parameter is `int (*a)[rows][cols]`.

## Pointer to an entire array

A pointer can point to a complete fixed-size array:

```c
int values[5] = {1, 2, 3, 4, 5};
int (*whole)[5] = &values;
```

`whole` points to all five elements as one array. `*whole` is that array, and `(*whole)[2]` is `values[2]`. `whole + 1` advances past the entire five-element block; it is not the same step as `values + 1`. A pointer to a 2D array similarly can be written `int (*whole2d)[3][5] = &matrix;` for `int matrix[3][5]`.

> [!note] Type spelling matters
> `int *p[5]` is an **array of five pointers**. `int (*p)[5]` is **one pointer to an array of five ints**. The parentheses change the declaration.

### Pointer to a whole matrix

```c
int matrix[3][5] = {
    {1, 2, 3, 4, 5},
    {6, 7, 8, 9, 10},
    {11, 12, 13, 14, 15}
};
int (*pt)[3][5] = &matrix;
```

| Expression | Meaning |
|---|---|
| `pt` | Pointer to the whole 3×5 matrix |
| `*pt` | The matrix; usually converts to a pointer to its first row |
| `*pt + 1` | Pointer to row 1 |
| `*(*pt + 1)` | Row 1; usually converts to a pointer to its first integer |
| `*(*(*pt + 1))` | First value of row 1: `6` |
| `(*pt)[1][2]` | Value in row 1, column 2: `8` |

Work from the declared type inward. The printed numeric address alone does not tell you the pointed-to type.

## Array decay and `sizeof`

In most expressions, an array converts to a pointer to its first element. Two common exceptions are the operands of `sizeof` and unary `&`.

```c
int a[5];
size_t count = sizeof a / sizeof a[0];  // 5
int (*p)[5] = &a;                      // address of the whole array
```

Inside a function with parameter `int a[]`, the parameter is adjusted to `int *a`. Its `sizeof` is the pointer size, so pass the element count separately. For a multidimensional parameter, the outermost length is omitted from the pointer type, but the inner dimensions remain part of the pointed-to type.

Next: [[10 - Dynamic arrays and strings]].
