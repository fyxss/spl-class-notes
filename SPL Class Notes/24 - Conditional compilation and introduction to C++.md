---
tags: [spl, c-programming, cpp, preprocessor, io]
---

# 24 — Conditional compilation and introduction to C++

Date: 27.09.2026.

## Header reminder

`<stdio.h>` declares `scanf`, `printf`, `fscanf`, `fprintf`, `freopen`, and the file-stream facilities. File functions need the same header even if the program does not use console input or output.

Use `"r"` when redirecting input from an existing file. `"w+"` would truncate it before reading, so it is not appropriate for that purpose.

## Conditional compilation for local files

An online judge supplies standard input and receives standard output; it may not provide local files such as `test.txt`. Compile file redirection only during local testing:

```c
#include <stdio.h>

int main(void) {
#ifdef LOCAL
    if (freopen("in.txt", "r", stdin) == NULL) return 1;
    if (freopen("out.txt", "w", stdout) == NULL) return 1;
#endif

    int n;
    if (scanf("%d", &n) == 1) printf("%d\n", n);
    return 0;
}
```

`#ifdef LOCAL` includes that section when the macro `LOCAL` is defined. For example:

```text
gcc -DLOCAL test.c -o test
```

Compile without `-DLOCAL` for ordinary standard input/output. A **makefile** can describe how to build a project containing multiple source files; it is a build file, not a `#makefile` C directive.

## Introduction to C++

C++ provides the **STL** (Standard Template Library). C I/O and C++ stream I/O use the following forms:

| C | C++ |
|---|---|
| `#include <stdio.h>` | `#include <iostream>` |
| `printf` | `cout <<` |
| `scanf` | `cin >>` |

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    int sum = a + b;
    cout << "Hello World\n";
    cout << "The sum is " << sum << '\n';
    return 0;
}
```

`<<` inserts output into `cout`; `>>` extracts input from `cin`. C++ stream input does not need `&` before the destination integer.

## C headers in C++

C++ forms of C library headers:

| C header | C++ header |
|---|---|
| `<stdio.h>` | `<cstdio>` |
| `<math.h>` | `<cmath>` |
| `<stdlib.h>` | `<cstdlib>` |
| `<string.h>` | `<cstring>` |

`<conio.h>` is not a standard C or C++ header, and there is no standard `<cconio>` equivalent.

## Namespace

A **namespace** groups names and helps distinguish names from different parts of a program. The standard-library streams belong to `std`:

```cpp
std::cout << "Hello World\n";
```

`using namespace std;` allows `cout` and `cin` without writing the prefix each time.

## C and C++ stream synchronization

By default, the standard C++ streams are synchronized with the corresponding C streams. Disable synchronization for faster stream I/O:

```cpp
ios_base::sync_with_stdio(false);
```

Call it before doing I/O. After disabling synchronization, use `cin`/`cout` consistently; mixing them with `scanf`/`printf` can produce unexpected buffering and ordering.

> [!note] Buffer clarification
> C++ streams have buffering too. Disabling synchronization lets them buffer independently of the C streams; it does not create buffering where there was none. C I/O functions still exist, but mixing the two systems after this change needs care.

## `cin.tie` and flushing

By default, `cin` is tied to `cout`, so input normally flushes pending output first:

```cpp
cout << "Enter a number: ";
cin >> n;
```

Untie them with:

```cpp
cin.tie(NULL); // nullptr is the usual C++ spelling
```

Then a prompt may need an explicit flush before waiting for input:

```cpp
cout << "Enter a number: " << flush;
cin >> n;
```

Flushing sends pending buffered output to the destination; it does not erase already printed text.

## `endl` versus `\n`

```cpp
cout << endl;  // newline and flush
cout << '\n';  // newline, without explicitly forcing a flush
```

Use `\n` when an immediate flush is unnecessary. Write `\n` directly instead of redefining `endl` with a macro.

Fast-I/O setup:

```cpp
#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (cin >> n) cout << n << '\n';
    return 0;
}
```

Back to [[index|Course Index]].
