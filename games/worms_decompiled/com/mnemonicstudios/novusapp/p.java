/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.i;
import com.mnemonicstudios.novusapp.n;
import com.mnemonicstudios.novusapp.o;
import javax.microedition.lcdui.Graphics;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class p {
    static int[] a = new int[8];
    static int[] b = new int[8];
    static int a = 0;
    static int b;
    static int c;
    static int d;
    static int e;
    static int f;
    static int g;
    static boolean a;

    public static final void a(int n2, int n3) {
        if (a < a.length) {
            p.a[p.a] = n2;
            p.b[p.a] = n3;
            ++a;
        }
    }

    public static final void a(int n2, int n3, int n4, int n5) {
        a = 0;
        b = n2;
        c = n3;
        d = n4;
        e = n5;
        f = 0;
    }

    public static final void a() {
        if (n.k && (f += 8) > 0) {
            f = 0;
        }
        if (n.l && !a) {
            f -= 8;
        }
    }

    public static final void a(Graphics graphics) {
        for (g = 0; g < a; ++g) {
            a = n.a.a(graphics, a[g], b, c, d, e, 16, n.H, b[g], f);
        }
        if (f < 0) {
            p.b();
        }
        if (!a) {
            p.c();
        }
    }

    public static final void b(Graphics graphics) {
        for (g = 0; g < a; ++g) {
            a = n.a.a(graphics, a[g], b, c, d, e, 16, n.H, b[g], f);
        }
    }

    public static final void b() {
        o.a.defineReferencePixel(6, 8);
        o.a.setTransform(6);
        o.a.setRefPixelPosition(60, c - 7);
        o.a.paint(i.a);
        o.a.setRefPixelPosition(180, c - 7);
        o.a.paint(i.a);
    }

    public static final void c() {
        o.a.defineReferencePixel(6, 8);
        o.a.setTransform(5);
        o.a.setRefPixelPosition(60, c + e + 7);
        o.a.paint(i.a);
        o.a.setRefPixelPosition(180, c + e + 7);
        o.a.paint(i.a);
    }

    static {
        f = 0;
        a = false;
    }
}

