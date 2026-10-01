---
tags: [spl, c-programming, structures, linked-lists]
---

# 13 — Structure pointers and self-referential structures

Date: 06.09.2026.

## A pointer member inside a structure

A structure can store a **pointer to a date** as a member:

```c
struct date {
    int d, m, y;
};

typedef struct {
    int age;
    char name[50];
    struct date *jd;
} people;

// Inside main:
people p;
struct date dt = {5, 6, 2026};
p.age = 26;
p.jd = &dt;
```

`p.jd` holds the address of `dt`. Access the month with either expression:

```c
p.jd->m
(*p.jd).m
```

The dot selects the pointer member `jd`; the arrow then accesses a member of the date it points to. The date must remain alive while that pointer is used.

> [!note] Parentheses in member access
> `(*p.jd).m` is correct. `*(p.jd).m` would try to apply `.` to the pointer `p.jd`, so it is not equivalent.

## Self-referential structure

A structure cannot contain an object of its own type directly:

```c
// Invalid definition:
struct tmp {
    int x;
    struct tmp t;
};
```

Such a member would require another complete `struct tmp` inside every `struct tmp`. Its size could never be completed. A pointer to the same type is allowed:

```c
struct tmp {
    int x;
    struct tmp *t;
};
```

This is a **self-referential structure**. It contains ordinary data members and a pointer that can store the address of another object of the same structure type.

## From arrays to linked lists

An array stores its elements together. A linked list connects separately stored nodes using pointers:

```text
array:       [ x ][ x ][ x ][ x ][ x ]

linked list: [ x | next ] -> [ x | next ] -> [ x | NULL ]
```

Each node contains data and a pointer to the next node. The nodes need not occupy consecutive memory locations.

```c
typedef struct Node {
    int x;
    struct Node *next;
} Node;

Node *start = NULL;
Node *last = NULL;
```

`start` points to the first node; `last` points to the final node. Both are `NULL` when the list is empty. The last node's `next` is `NULL`.

To attach a newly created node at the end of a nonempty list:

```c
last->next = new_node;
last = new_node;
```

For the first node, set `start = last = new_node`. Initialize its data and set its `next` to `NULL` before linking it.

Next: [[14 - Linked list creation, insertion and traversal]].
