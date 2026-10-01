---
tags: [spl, c-programming, functions, variadic]
---

# 23 — Variable length arguments

Date: 20.09.2026.

## Ellipsis and `<stdarg.h>`

A function can receive a fixed named parameter followed by a varying number of arguments. The ellipsis `...` allows additional arguments:

```c
void calc(int cnt, ...);
```

In `calc(3, 5, 2, 6)`, the count says that three integer values follow.

| Facility | Purpose |
|---|---|
| `va_list pt` | Tracks traversal of the additional arguments |
| `va_start(pt, cnt)` | Starts traversal after the named parameter |
| `va_arg(pt, int)` | Reads the next argument as `int` and advances |
| `va_end(pt)` | Ends traversal |

Include `<stdarg.h>`. `va_list` handles traversal according to the calling convention; the arguments need not be stored consecutively in memory.

## Sum a known number of integers

```c
#include <stdio.h>
#include <stdarg.h>

void calc(int cnt, ...) {
    va_list pt;
    va_start(pt, cnt);

    int sum = 0;
    for (int i = 0; i < cnt; ++i) {
        int val = va_arg(pt, int);
        sum += val;
    }

    va_end(pt);
    printf("%d\n", sum);
}

// calc(3, 5, 2, 6); // prints 13
```

The count must agree with the arguments supplied. A variadic function does not automatically know their number or types.

## Mixed types in a known order

For `calc(3, 5, 3.14, "Ra")`, reading all three values as `int` is incorrect. In a separate function expecting exactly that order, retrieve them with the matching types:

```c
void calc(int cnt, ...) {
    if (cnt != 3) return;
    va_list pt;
    va_start(pt, cnt);

    int val = va_arg(pt, int);
    double pi = va_arg(pt, double);
    char *s = va_arg(pt, char *);

    printf("%d %f %s\n", val, pi, s);
    va_end(pt);
}
```

Use a pointer for the string returned by `va_arg`, rather than trying to initialize a character array from that returned pointer. If the argument order changes, the retrieval order must change too.

> [!note] Matching argument types
> For the additional arguments, `float` is promoted to `double`, and small integer types such as `char` are promoted to `int` where applicable. Retrieve the promoted type. Asking `va_arg` for an incompatible type gives undefined behavior. Do not modify the string literal through `s`.

## Describe types with a format string

Replace the count with a string such as `"ids"`, where `i` means integer, `d` means double, and `s` means string:

```c
void calc(const char *s, ...) {
    va_list pt;
    va_start(pt, s);

    for (int i = 0; s[i] != '\0'; ++i) {
        if (s[i] == 'i') {
            int val = va_arg(pt, int);
            printf("%d ", val);
        } else if (s[i] == 'd') {
            double pi = va_arg(pt, double);
            printf("%f ", pi);
        } else if (s[i] == 's') {
            char *text = va_arg(pt, char *);
            printf("%s ", text);
        }
    }

    printf("\n");
    va_end(pt);
}

// calc("ids", 5, 3.14, "Ra");
// calc("sdi", "Ra", 3.14, 5);
```

Each character describes the next argument's type, allowing the order to change when the description changes with it. These `calc` definitions are alternatives; C does not overload functions with the same name.

## Sentinel example: sum until `-1`

For `sum(1, 2, 3, 4, -1)`, `-1` marks the end and must not be included in the total:

```c
int sum(int first, ...) {
    if (first == -1) return 0;

    int total = first;
    va_list pt;
    va_start(pt, first);

    while (1) {
        int val = va_arg(pt, int);
        if (val == -1) break;
        total += val;
    }

    va_end(pt);
    return total;
}

// sum(1, 2, 3, 4, -1) returns 10
```

Pass only integers and always include the sentinel. Use `va_arg(pt, int)`, check `-1` before addition, return `total`, and call `va_end`. Here `-1` cannot also be an ordinary value to include in the sum.

Next: [[24 - Conditional compilation and introduction to C++]].
