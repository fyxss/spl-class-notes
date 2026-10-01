---
tags: [spl, c-programming, linked-lists, lab]
---


# 14 — Linked list creation, insertion and traversal

SPL lab: 9/6/2026.

## Node and creation function

A node stores its value in `data` and its link in `next`:

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *create_node(int data) {
    Node *nw = malloc(sizeof(Node));
    if (nw == NULL) return NULL;
    nw->data = data;
    nw->next = NULL;
    return nw;
}
```

`create_node(5)` creates a node containing 5 and returns its address. Use `sizeof(Node)` for allocation: the size includes both members and any padding, so it is not always 8 bytes.

```text
start -> [3 | next] -> [5 | next] -> [2 | NULL] <- last

tmp   -> [8 | NULL]       newly created, not yet linked
```

## Updating `start` and `last`

Declare these in the calling function:

```c
Node *start = NULL, *last = NULL;
```

To update the caller's `start` or `last`, pass their addresses as `Node **`, using `&start` and `&last` at the call site. A `Node *` parameter alone copies the pointer.

## Insert into last

```c
void insert_into_last(int data, Node **start, Node **last) {
    Node *tmp = create_node(data);
    if (tmp == NULL) return;

    if (*start == NULL) {
        *start = *last = tmp;
        return;
    }

    (*last)->next = tmp;
    *last = tmp;
}
```

First connect the old last node to `tmp`; then move `last` to `tmp`.

## Insert into first

```c
void insert_into_first(int data, Node **start, Node **last) {
    Node *tmp = create_node(data);
    if (tmp == NULL) return;

    tmp->next = *start;
    *start = tmp;
    if (*last == NULL) *last = tmp;
}
```

The new node points to the previous first node. If the list was empty, it becomes both the first and the last node.

```c
// Example calls inside main:
insert_into_last(3, &start, &last);
insert_into_last(5, &start, &last);
insert_into_first(8, &start, &last);
```

Repeated insertion at the last keeps the input order. Repeated insertion at the first reverses it. For the sequence `3, 5, 2, 9, 1, 6, 2`:

```text
insert at last:  3 5 2 9 1 6 2
insert at first: 2 6 1 9 2 5 3
```

## Print the list

Move a temporary pointer so that `start` remains available:

```c
void printlist(Node *start) {
    Node *cur = start;
    while (cur != NULL) {
        printf("%d ", cur->data);
        cur = cur->next;
    }
    printf("\n");
}
```

## Check whether a value is present

```c
int is_present(int val, Node *start) {
    Node *cur = start;
    while (cur != NULL) {
        if (cur->data == val) return 1;
        cur = cur->next;
    }
    return 0;
}
```

Return 1 when found; return 0 only after traversing the whole list.

## Find the size

```c
int size(Node *start) {
    int cnt = 0;
    Node *cur = start;
    while (cur != NULL) {
        ++cnt;
        cur = cur->next;
    }
    return cnt;
}
```

Initialize `cur` to `start`, advance it after counting each node, and return `cnt`.

## Insert at a position

Positions are **zero-based**. Insert 8 at position 1:

```text
before: 3 -> 5 -> 2 -> 4 -> NULL
after:  3 -> 8 -> 5 -> 2 -> 4 -> NULL
```

For a position greater than 0, reach the node at `pos - 1`. Then perform the two steps in this order:

```c
tmp->next = cur->next;
cur->next = tmp;
```

```c
void insert_at_pos(int data, int pos, Node **start, Node **last) {
    if (pos < 0) return;
    if (pos == 0) {
        insert_into_first(data, start, last);
        return;
    }

    Node *cur = *start;
    int i = 0;
    while (i < pos - 1 && cur != NULL) {
        cur = cur->next;
        ++i;
    }
    if (cur == NULL) return;  // position is outside the list

    Node *tmp = create_node(data);
    if (tmp == NULL) return;
    tmp->next = cur->next;
    cur->next = tmp;
    if (tmp->next == NULL) *last = tmp;
}
```

Inserting at `pos == size(start)` appends. The pointer assignments happen **after** traversal, not inside its loop. Release allocated nodes when finished; deletion functions appear in [[17 - Linked list deletion and pointer parameters]].

Next: [[15 - Unions and merge sort]].
