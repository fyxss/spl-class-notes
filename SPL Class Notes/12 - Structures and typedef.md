---
tags: [spl, c-programming, structures, typedef]
---

# 12 — Structures and `typedef`

## Defining and declaring a structure

A **structure** groups related members, possibly of different data types, into one object. For example, a person has an age, a name, and a weight:

```c
struct person {
    int age;
    char name[50];
    float weight;
};

struct person p1 = {26, "Rahim", 63.5f};
```

The semicolon after the closing brace is required in a structure definition. Declare an object afterward as above, or at the end of the definition:

```c
struct bucket {
    int age;
    char name[50];
    float weight;
} p2 = {26, "Rahim", 63.5f};
```

If `int` and `float` occupy 4 bytes each, the members total `4 + 50 + 4 = 58` bytes. The structure may occupy more because of padding for alignment. Use `sizeof(struct person)` to obtain its actual size.

## Nested structures and member access

A structure can contain another structure as a member:

```c
struct date {
    int day, month, year;
};

struct employee {
    int age;
    char name[50];
    struct date joining_date;
};

struct employee p = {26, "Rahim", {5, 12, 2020}};
printf("%d\n", p.joining_date.month);
```

Use the dot operator to access a member of a structure object: `p.age`, `p.name`, and `p.joining_date.year`.

## Array of structures

For an array of structures, index first and then select a member: `people[i].age`. Using the `struct employee` definition above, read three employees:

```c
int main(void) {
    struct employee people[3];

    for (int i = 0; i < 3; ++i) {
        printf("Enter age, name, and joining date (day month year):\n");
        if (scanf("%d %49s %d %d %d",
                  &people[i].age, people[i].name,
                  &people[i].joining_date.day,
                  &people[i].joining_date.month,
                  &people[i].joining_date.year) != 5)
            return 1;
    }

    for (int i = 0; i < 3; ++i) {
        printf("%s, age %d, joined %02d/%02d/%04d\n",
               people[i].name, people[i].age,
               people[i].joining_date.day,
               people[i].joining_date.month,
               people[i].joining_date.year);
    }
    printf("Total array size: %zu bytes\n", sizeof people);
    return 0;
}
```

Include `<stdio.h>` for input and output. `%49s` reads a single-word name of at most 49 characters and leaves room for `\0` in the 50-character array. Numeric members need `&` with `scanf`; the character array already supplies its first character's address.

## Passing a structure

Passing `struct employee p` makes a copy. Passing `struct employee *p` provides an address so the function can access or change the caller's object:

```c
void print_age(struct employee p) {
    printf("%d\n", p.age);
}

void change_age(struct employee *p, int new_age) {
    p->age = new_age;        // same as (*p).age
}
```

Parentheses matter in `(*p).age` because `.` has higher precedence than unary `*`. The arrow operator `p->age` is the usual clearer spelling.

## `typedef`

Use `typedef` to give a type another name:

```c
typedef int age_t;

typedef struct {
    int age;
    char name[50];
    float weight;
} Person;

Person people[3];
```

`typedef` creates a type alias, not a data object. `Person people[3];` then declares three objects of that structure type.

## Bubble sort with a structure

Store each value together with its original index. Compare the values and swap **whole structures**, so each index stays attached to its value.

```c
#include <stdio.h>

typedef struct {
    int val;
    int in;   // original index
} point;

int compare(point a, point b) {
    if (a.val < b.val) return -1;
    if (a.val > b.val) return 1;
    return 0;
}

void bubble_sort(point a[], int n) {
    for (int pass = 0; pass < n - 1; ++pass) {
        int swapped = 0;
        for (int j = 0; j < n - 1 - pass; ++j) {
            if (compare(a[j], a[j + 1]) > 0) {
                point temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
}

int main(void) {
    int values[] = {2, 1, 5, 6, 2, 6, 5, 9};
    point a[8];
    for (int i = 0; i < 8; ++i) {
        a[i].val = values[i];
        a[i].in = i;
    }
    bubble_sort(a, 8);
    for (int i = 0; i < 8; ++i)
        printf("%d (index %d)\n", a[i].val, a[i].in);
    return 0;
}
```

Sorted values: `1, 2, 2, 5, 5, 6, 6, 9`. Their original indices are `1, 0, 4, 2, 6, 3, 5, 7`. Equal values keep their original order because the comparison does not swap them.

Next: [[13 - Structure pointers and self-referential structures]].
