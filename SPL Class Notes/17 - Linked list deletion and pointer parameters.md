---
tags: [spl, c-programming, linked-lists, pointers]
---

# 17 — Linked list deletion and pointer parameters

Use the `Node` definition in [[14 - Linked list creation, insertion and traversal]].

## Delete the last node

For a list with several nodes, stop at the node **before** `last`:

```text
start -> ... -> [data | next] -> [data | NULL] <- last
                      cur
```

Set `cur->next` to `NULL`, free the old last node, and move `last` to `cur`. Handle the empty list and the one-node list first.

```c
void delete_last(Node **start, Node **last) {
    if (*start == NULL) {
        printf("Nothing to delete\n");
        return;
    }
    if (*start == *last) {
        free(*start);
        *start = *last = NULL;
        return;
    }

    Node *cur = *start;
    while (cur->next != *last) cur = cur->next;
    cur->next = NULL;
    free(*last);
    *last = cur;
}
```

## Delete the first node

Save the next node before freeing the first:

```c
void delete_first(Node **start, Node **last) {
    if (*start == NULL) {
        printf("Nothing to delete\n");
        return;
    }

    Node *cur = (*start)->next;
    free(*start);
    *start = cur;
    if (*start == NULL) *last = NULL;
}
```

For a one-node list, deletion leaves both `start` and `last` as `NULL`.

## Why pointer-to-pointer parameters are needed

Passing an address is often called “pass by reference.” In C, arguments are passed **by value**, including pointer arguments. A copied address still lets a function change the object at that address.

```c
void change_copy(int b) {
    b = 10;                   // caller's integer is unchanged
}

void change_value(int *b) {
    *b = 100;                 // changes the caller's integer
}

void change_pointer(int **b, int *new_address) {
    *b = new_address;         // changes the caller's pointer
}

// Inside main:
// int a = 5, other = 20;
// int *p = &a;
// change_copy(a);             // a is still 5
// change_value(p);            // a becomes 100
// change_pointer(&p, &other); // p now points to other
```

Assigning to a local `int *b` changes only that local pointer. To change the caller's `Node *start`, receive `Node **start` and assign to `*start`.

> [!note] Pointer assignment
> `b = 100` does not change the pointed-to integer. With `int *b`, write `*b = 100`; with `int **b`, write `**b = 100` to change the integer, or assign an appropriate address to `*b` to change the caller's pointer.

## Delete at a position

Deletion can remove the first node, last node, or a node identified by position or occurrence. The following function deletes by **zero-based position**.

To delete a middle node:

```c
Node *temp = cur->next;
cur->next = temp->next;
free(temp);
```

`cur` is the node immediately before the one being removed. Reconnect the list before freeing `temp`.

```c
void delete_at_pos(int pos, Node **start, Node **last) {
    if (*start == NULL) {
        printf("Nothing to delete\n");
        return;
    }
    if (pos < 0) {
        printf("Invalid position\n");
        return;
    }
    if (pos == 0) {
        delete_first(start, last);
        return;
    }

    Node *cur = *start;
    int cnt = 0;
    while (cnt < pos - 1 && cur->next != NULL) {
        cur = cur->next;
        ++cnt;
    }
    if (cnt != pos - 1 || cur->next == NULL) {
        printf("Invalid position\n");
        return;
    }

    Node *temp = cur->next;
    cur->next = temp->next;
    if (temp == *last) *last = cur;
    free(temp);
}
```

```c
// Inside main, for the list created earlier:
// delete_at_pos(2, &start, &last);
// delete_last(&start, &last);
// while (start != NULL) delete_first(&start, &last);
```

The position checks avoid dereferencing a nonexistent node. Updating `last` is also necessary when the removed node was the final node.

Next: [[18 - Binary files, positioning and record access]].
