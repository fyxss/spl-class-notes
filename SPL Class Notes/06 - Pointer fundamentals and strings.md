---
tags: [spl, c-programming, pointers, strings]
---

# 06 — Pointer fundamentals and strings

## Address, value, and pointer type

`int a = 10; int *p = &a;` means `p` stores the address of `a`; `*p` is the value of `a`. The pointer itself has its own address. Two pointers may refer to the same object:

```c
int a = 10;
int *p = &a, *q = &a;
*p = 5;   // a == 5
*q = 12;  // a == 12; *p also reads 12
```

Initialize a pointer before dereferencing it. `int *p = NULL;` makes it explicitly point nowhere; check `p != NULL` before `*p`. To print an address, use `%p` and cast to `void *`:

```c
printf("%p\n", (void *)p);
```

`sizeof(p)` is the size of the pointer object; `sizeof(*p)` is the size of the pointed-to type. A common 64-bit system uses an 8-byte pointer and a 4-byte `int`, but the exact sizes depend on the implementation. Print a `sizeof` result with `%zu`.

### Copying an address versus copying a value

```c
int a = 5, b = 7;
int *p = &a, *q = &b;
p = q;       // both pointers now point to b; a is still 5
```

Starting again with `p = &a` and `q = &b`, `*p = *q` copies 7 into `a` while the pointers keep their original addresses.

## `void *` and `const`

A `void *` is a generic object pointer. It can hold addresses of different object types, but C must know the target type before dereferencing it:

```c
int a = 5;
void *generic = &a;
printf("%d", *(int *)generic);
```

The position of `const` determines what can change:

| Declaration | What cannot change? |
|---|---|
| `const int *p` | `*p` through `p` |
| `int *const p = &a` | the address stored in `p` |
| `const int *const p = &a` | both, through `p` |

A `const int *` may point to either a constant or a nonconstant `int`. In either case, the value cannot be changed through that pointer.

## Arrays and pointers

For `int arr[] = {5,2,1,3};`, most expressions using `arr` convert it to a pointer to `arr[0]`. Thus `arr[1]` is the same element as `*(arr+1)`. Pointer arithmetic advances by whole elements, not individual bytes.

```c
int arr[] = {5, 2, 1, 3};
printf("%d", *(arr + 3));  // 3
```

When a function receives an array, also pass its length. To reverse an array, swap the first and last elements, then move toward the middle:

```c
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void reverse(int a[], int n) {
    for (int i = 0; i < n / 2; ++i)
        swap(&a[i], &a[n - 1 - i]);
}
```

An automatic local object's lifetime ends when the function returns. A returned pointer to that object must not be used to access it afterward.

## String comparison and substring practice

To check whether two strings are equal, compare matching positions until either a difference or `\0` is reached:

```c
int same_string(const char *a, const char *b) {
    while (*a != '\0' && *a == *b) {
        ++a;
        ++b;
    }
    return *a == *b;
}
```

### Substring and subsequence

A **substring** is contiguous: `"bca"` occurs in `"abcaab"`. A **subsequence** preserves order but may skip characters: `"aaa"` is a subsequence of `"abcaab"`, but is not a substring.

### Finding a substring

Test each possible starting position of the text against all characters of the pattern. Return the first matching index, or `-1` if no match exists.

```c
int string_length(const char *s) {
    int length = 0;
    while (s[length] != '\0') ++length;
    return length;
}

int equal_n(const char *a, const char *b, int n) {
    for (int i = 0; i < n; ++i)
        if (a[i] != b[i]) return 0;
    return 1;
}

int find_substring(const char *text, const char *pattern) {
    int n = string_length(text);
    int m = string_length(pattern);

    for (int i = 0; i <= n - m; ++i)
        if (equal_n(text + i, pattern, m)) return i;

    return -1;
}
```

`find_substring("abcaab", "bca")` returns 1. An empty pattern matches at index 0. For text length `n` and pattern length `m`, this method takes O(nm) time in the worst case. The library function `strstr` from `<string.h>` returns a pointer to the first match, or `NULL`.

Next: [[07 - Dynamic memory allocation]].
