/*
 * Decompiled with CFR 0.152.
 */
package com.mnemonicstudios.novusapp;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class h {
    static short[] a = new short[1024];
    static short[] b = new short[1024];
    static int a;
    static int b;
    static int c;
    static int d;
    static int e;
    static long a;
    static long b;
    static long c;
    static int f;
    static long d;
    static long e;

    public h() {
        h.a();
    }

    public static final void a() {
        for (a = 0; a < 256; ++a) {
            h.a[h.a] = (short)h.b(c);
            h.b[h.a] = (short)h.a(c);
            h.a[511 - h.a] = -a[a];
            h.b[511 - h.a] = b[a];
            h.a[512 + h.a] = -a[a];
            h.b[512 + h.a] = -b[a];
            h.a[1023 - h.a] = a[a];
            h.b[1023 - h.a] = -b[a];
            c += b;
        }
    }

    public static final int a(long l2) {
        b = 3L;
        a = -1L;
        c = l2;
        for (e = 0; e < d; ++e) {
            c += a * (h.a(l2, b) / h.a(b));
            b += 2L;
            a *= -1L;
        }
        return (int)(c >> 9);
    }

    public static final int b(long l2) {
        b = 2L;
        a = -1L;
        c = 0xFFFFFFL;
        for (e = 0; e < d; ++e) {
            c += a * (h.a(l2, b) / h.a(b));
            b += 2L;
            a *= -1L;
        }
        return (int)(c >> 9);
    }

    public static final long a(long l2) {
        d = l2;
        e = 1L;
        f = 0;
        while ((long)f < l2) {
            e *= d;
            --d;
            ++f;
        }
        return e;
    }

    public static final long a(long l2, long l3) {
        e = l2;
        if (l3 > 1L) {
            f = 1;
            while ((long)f < l3) {
                e = e * l2 >> 24;
                ++f;
            }
        }
        return e;
    }

    static {
        b = 102943;
        c = 0;
        d = 5;
        f = 0;
        d = 0L;
        e = 0L;
    }
}

