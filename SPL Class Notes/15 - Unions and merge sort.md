---
tags: [spl, c-programming, unions, sorting]
---

# 15 — Unions and merge sort

Date: 07.09.2026.

## String assignment reminder

After declaring an array, assign its text by copying:

```c
#include <string.h>

char s[50];
// s = "Rahim";          // invalid: arrays cannot be assigned this way
strcpy(s, "Rahim");      // valid: copy into the existing array
```

At declaration, `char s[50] = "Rahim";` is valid initialization. A pointer can instead refer to the literal:

```c
const char *s = "Rahim";
```

`strcpy` returns the destination pointer; do not assign that return value to the array `s`.

## Linked list forms

Three linked list forms:

- **Singly linked:** each node stores `data` and `next`.
- **Circular linked:** the last node links back to the first.
- **Doubly linked:** each node stores `data`, `prev`, and `next`.

```text
singly:  [data|next] -> [data|next] -> NULL
circular: first -> second -> last -> first
doubly:  NULL <- first <-> second <-> last -> NULL
```

## Union

A structure gives each member its own storage. A **union** shares storage among its members, so it normally holds one member's value at a time.

```c
typedef union addition {
    char color[20];
    int size;
} add;

add var1 = {.color = "Black"};
add var2 = {.size = 5};
```

Designated initialization selects the intended member. With a plain initializer, the first member is selected; `{5}` would not select `size` here.

Access a member with `.` for an object or `->` for a pointer:

```c
var2.size = 6;
add *p = &var2;
p->size = 7;
```

Writing `size` uses the same storage as `color`, so do not expect the previous color string to remain available.

> [!note] Union size and members
> Its size is at least the size of its largest member and can include alignment padding. This example usually occupies 20 bytes; use `sizeof(add)` for the actual size. Additional members, including another `int`, are allowed. The restriction is on retaining independent member values at the same time, not on the number of members.

## Merging two sorted parts

**Merging** combines sorted sequences into one sorted sequence. In this code, the two parts are `arr[0..mid-1]` and `arr[mid..sz-1]`. `aux` temporarily holds the merged values.

```c
void merge(int *arr, int mid, int sz, int *aux) {
    int i = 0, j = mid, k = 0;

    while (i < mid && j < sz) {
        if (arr[i] < arr[j])
            aux[k++] = arr[i++];
        else
            aux[k++] = arr[j++];
    }
    while (i < mid) aux[k++] = arr[i++];
    while (j < sz) aux[k++] = arr[j++];

    for (i = 0; i < sz; ++i) arr[i] = aux[i];
}
```

Compare the next unused value of each part, copy the smaller one, then copy whichever part has values left. Finally copy `aux` back into `arr`.

## Recursive merge sort

```c
void sort(int *arr, int sz, int *aux) {
    if (sz <= 1) return;
    int mid = sz / 2;

    sort(arr, mid, aux);
    sort(arr + mid, sz - mid, aux);
    merge(arr, mid, sz, aux);
}

// Inside main:
// int arr[] = {2, 1, 5, 6, 2, 6, 5, 9};
// int aux[8];
// sort(arr, 8, aux);
```

`arr + mid` points to the first element of the right part. Allocate `aux` for at least the original array length. `sz <= 1` also handles an empty part. The same temporary buffer can be reused because these recursive calls run one after another. Time: O(n log n); auxiliary array space: O(n).

To sort `point` structures, compare their `val` members and copy whole structures.

Next: [[16 - File IO and opening modes]].
