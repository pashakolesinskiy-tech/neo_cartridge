/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 *  javax.microedition.lcdui.Image
 *  javax.microedition.lcdui.game.Sprite
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.h;
import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.n;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class i {
    Sprite[] a;
    Image[] a;
    int a;
    int b;
    int c;
    int d;
    int e;
    int f;
    int g;
    int h;
    int i;
    public static Graphics a;
    static int j;
    static int k;
    int l;
    int m;
    int n;
    static long a;
    static long b;
    static long c;
    static long d;
    static long e;
    static long f;
    static long g;
    static long h;
    static long i;
    static int o;
    static long j;
    int p;
    int q;
    int r;
    int s;
    int[] a;
    int t;
    int u;
    int v;
    boolean a = new Image[160];

    public i() {
        new h();
        this.a = 0;
        this.b = 0;
        this.c = 0;
        this.d = 0;
        this.i = 0;
        this.l = 0;
        this.m = 0;
        this.n = 0;
        this.r = 6554;
        this.a = new int[10];
        this.t = 0;
        this.v = 10;
        this.a = false;
    }

    public final int a(String string, int n2, int n3) {
        if (this.i < 160) {
            ++this.i;
            try {
                this.a[this.i] = Image.createImage((String)("/" + string));
                this.a[this.i] = new Sprite(this.a[this.i], n2, n3);
            }
            catch (Exception exception) {
                Exception exception2 = exception;
                exception.printStackTrace();
                return -1;
            }
            return this.i;
        }
        return -1;
    }

    public final void a(String string, int n2, int n3, int n4) {
        com.mnemonicstudios.novusapp.n.a(a, string, com.mnemonicstudios.novusapp.n.b, n2, n3, 36, n4, 68);
    }

    public final void a(int n2, int n3, int n4, int n5) {
        this.g = n3 - this.c;
        this.h = n4 - this.d;
        switch (com.mnemonicstudios.novusapp.j.c) {
            case 0: {
                this.e(n2, this.g, this.h, n5);
                return;
            }
            case 2: {
                this.e(n2, this.g, this.h, n5);
                return;
            }
            case 1: {
                this.e(n2, this.g, this.h, n5);
            }
        }
    }

    public final void b(int n2, int n3, int n4, int n5) {
        switch (com.mnemonicstudios.novusapp.j.c) {
            case 0: {
                this.e(n2, n3, n4, n5);
                return;
            }
            case 1: 
            case 2: {
                this.e(n2, n3, n4, n5);
            }
        }
    }

    public final void c(int n2, int n3, int n4, int n5) {
        switch (com.mnemonicstudios.novusapp.j.c) {
            case 0: {
                this.e(n2, n3, n4, n5);
                return;
            }
            case 1: 
            case 2: {
                this.e(n2, n3, n4, n5);
            }
        }
    }

    public final int a(int n2) {
        return n2 - this.c;
    }

    public final int b(int n2) {
        return n2 - this.d;
    }

    public final void a(int n2, int n3, int n4, int n5, int n6) {
        switch (com.mnemonicstudios.novusapp.j.c) {
            case 0: {
                try {
                    this.a[n2].setFrame(n5);
                }
                catch (Exception exception) {
                    this.a[n2].setFrame(0);
                }
                this.g = n3 - this.c;
                this.h = n4 - this.d;
                this.a[n2].setPosition(this.g - (this.a[n2].getWidth() >> 1), this.h - this.a[n2].getHeight() + 3);
                a.setClip(0, 0, 240, 320);
                if (n6 > 0) {
                    this.a[n2].defineReferencePixel(this.a[n2].getWidth() >> 1, this.a[n2].getHeight());
                    this.a[n2].setTransform(2);
                } else {
                    this.a[n2].setTransform(0);
                }
                this.a[n2].paint(a);
                return;
            }
            case 2: {
                try {
                    this.a[n2].setFrame(n5);
                }
                catch (Exception exception) {
                    this.a[n2].setFrame(0);
                }
                this.g = n3 - this.c;
                this.h = n4 - this.d;
                a.setClip(0, 0, 240, 320);
                if (n6 > 0) {
                    this.a[n2].setTransform(7);
                } else {
                    this.a[n2].setTransform(5);
                }
                this.a[n2].setPosition(240 - this.h + 13, this.g - (this.a[n2].getWidth() >> 1));
                this.a[n2].paint(a);
                return;
            }
            case 1: {
                try {
                    this.a[n2].setFrame(n5);
                }
                catch (Exception exception) {
                    this.a[n2].setFrame(0);
                }
                this.g = n3 - this.c;
                this.h = n4 - this.d;
                a.setClip(0, 0, 240, 320);
                if (n6 > 0) {
                    this.a[n2].setTransform(4);
                } else {
                    this.a[n2].setTransform(6);
                }
                this.a[n2].setPosition(this.h - this.a[n2].getHeight() + 3, 320 - (this.g - (this.a[n2].getWidth() >> 1)) - 16);
                this.a[n2].paint(a);
            }
        }
    }

    public final void b(int n2, int n3, int n4, int n5, int n6) {
        this.g = n2 - this.c;
        this.h = n3 - this.d;
        this.e = n4 - this.c;
        this.f = n5 - this.d;
        a.setColor(n6);
        a.drawLine(this.g, this.h, this.e, this.f);
    }

    public final void a(Graphics graphics, int n2, int n3, int n4, int n5, int n6) {
        this.a(graphics, n2, n3, n4, n5, n6, 0);
    }

    public final void a(Graphics graphics, int n2, int n3, int n4, int n5, int n6, int n7) {
        switch (com.mnemonicstudios.novusapp.j.c) {
            case 0: {
                try {
                    try {
                        this.a[n2].setFrame(n5);
                    }
                    catch (Exception exception) {
                        this.a[n2].setFrame(0);
                    }
                    this.g = n3;
                    this.h = n4;
                    this.a[n2].setPosition(this.g - (this.a[n2].getWidth() >> 1), this.h - this.a[n2].getHeight() + 3);
                    if (n6 > 0) {
                        this.a[n2].defineReferencePixel(this.a[n2].getWidth() >> 1, this.a[n2].getHeight());
                        this.a[n2].setTransform(2);
                    } else {
                        this.a[n2].setTransform(0);
                    }
                    this.a[n2].paint(graphics);
                    return;
                }
                catch (Exception exception) {
                    Exception exception2 = exception;
                    exception.printStackTrace();
                    return;
                }
            }
            case 1: 
            case 2: {
                try {
                    this.a[n2].setFrame(n5);
                }
                catch (Exception exception) {
                    this.a[n2].setFrame(0);
                }
                this.g = n3;
                this.h = n4;
                a.setClip(0, 0, 240, 320);
                this.a[n2].setPosition(this.g - (this.a[n2].getWidth() >> 1), this.h - this.a[n2].getHeight() + 3);
                if (n6 > 0) {
                    this.a[n2].setTransform(7);
                } else {
                    this.a[n2].setTransform(5);
                }
                this.a[n2].paint(graphics);
            }
        }
    }

    public final void a(Graphics graphics) {
        a = graphics;
    }

    public final void a(int n2, int n3) {
        if (n2 < -128) {
            n2 = -128;
        }
        if (n2 > 1152) {
            n2 = 1152;
        }
        if (n3 < -128) {
            n3 = -128;
        }
        if (n3 > 640) {
            n3 = 640;
        }
        if (this.l > 0) {
            this.m = this.l - com.mnemonicstudios.novusapp.n.a(this.l << 1);
            this.n = this.l - com.mnemonicstudios.novusapp.n.a(this.l << 1);
            --this.l;
        }
        this.a = n2 + this.m;
        this.b = n3 + this.n;
        this.c = n2 - (com.mnemonicstudios.novusapp.j.a >> 1) + this.m;
        this.d = n3 - (com.mnemonicstudios.novusapp.j.b >> 1) + this.n;
    }

    public final boolean a(int n2, int n3) {
        if (n2 < this.c) {
            return false;
        }
        if (n3 < this.d) {
            return false;
        }
        if (n2 > this.c + com.mnemonicstudios.novusapp.j.a) {
            return false;
        }
        return n3 <= this.d + com.mnemonicstudios.novusapp.j.b;
    }

    public final boolean a(int n2, int n3, int n4) {
        if (n2 < this.c - n4) {
            return false;
        }
        if (n3 < this.d - n4) {
            return false;
        }
        if (n2 > this.c + com.mnemonicstudios.novusapp.j.a + n4) {
            return false;
        }
        return n3 <= this.d + com.mnemonicstudios.novusapp.j.b + n4;
    }

    public final void a(int n2, int n3, int n4) {
        if ((j += k) < 1 || j > 4) {
            k = -k;
        }
        this.d(n2 + j, n3 + j, 0, 5);
        this.d(n2 + j, n3 + j, n4, 3);
    }

    public final void d(int n2, int n3, int n4, int n5) {
        a.setColor(n4);
        a.fillRect(120 - n2, 160 - n2, n3 + n5, n5);
        a.fillRect(120 - n2, 160 - n2, n5, n3 + n5);
        a.fillRect(120 + (n2 - n3), 160 + n2, n3 + n5, n5);
        a.fillRect(120 + n2, 160 + (n2 - n3), n5, n3 + n5);
        a.fillRect(120 - n2, 160 + n2, n3 + n5, n5);
        a.fillRect(120 - n2, 160 + (n2 - n3), n5, n3);
        a.fillRect(120 + (n2 - n3), 160 - n2, n3, n5);
        a.fillRect(120 + n2, 160 - n2, n5, n3 + n5);
    }

    public final void a(int n2) {
        this.l = n2;
    }

    public final int a() {
        return this.a;
    }

    public final int b() {
        return this.b + 0;
    }

    public final int c() {
        return this.c;
    }

    public final int d() {
        return this.d + 0;
    }

    public static final int a(int n2, int n3) {
        if (n3 == 0) {
            if (n2 > 0) {
                return 0;
            }
            return 2048;
        }
        if (n2 == 0) {
            if (n3 > 0) {
                return 1024;
            }
            return 3072;
        }
        a = n2;
        b = n3;
        c = (a << 16) / b;
        if (n3 > 0) {
            return 1024 - com.mnemonicstudios.novusapp.i.a(c);
        }
        return 3072 - com.mnemonicstudios.novusapp.i.a(c);
    }

    public static final long a(long l2, long l3) {
        g = (l3 & 1L) == 1L ? -1L : 1L;
        i = com.mnemonicstudios.novusapp.i.b(l2, 2L * l3 + 1L);
        d = (i *= g) / (2L * l3 + 1L);
        return d;
    }

    public static final int a(long l2) {
        if (l2 < -65535L || l2 > 65536L) {
            e = 0x100000000L / l2;
            h = 0L;
            for (f = 0L; f < 10L; ++f) {
                h += com.mnemonicstudios.novusapp.i.a(e, f);
            }
            h = h < 0L ? -102944L - h : 102944L - h;
        } else {
            h = 0L;
            for (f = 0L; f < 10L; ++f) {
                h += com.mnemonicstudios.novusapp.i.a(l2, f);
            }
        }
        return (int)(h /= 101L);
    }

    private static long b(long l2, long l3) {
        j = l2;
        if (l3 > 1L) {
            o = 1;
            while ((long)o < l3) {
                j = j * l2 >> 16;
                ++o;
            }
        }
        return j;
    }

    public final void c(int n2, int n3, int n4, int n5, int n6) {
        try {
            com.mnemonicstudios.novusapp.n.a.b(a, n2, n3, n4, n5);
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void a(int n2, int n3, int n4, int n5, int n6, int n7) {
        try {
            this.a[n5].setFrame(n2);
            this.a[n5].setTransform(n7);
            this.a[n5].setPosition(n3, n4);
            this.a[n5].paint(a);
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void e(int n2, int n3, int n4, int n5) {
        this.f(n2, n3 + 2, n4 + 2, com.mnemonicstudios.novusapp.n.J);
        this.f(n2, n3, n4, n5);
    }

    public final void f(int n2, int n3, int n4, int n5) {
        try {
            this.s = 0;
            this.q = Math.abs(n2);
            this.t = 0;
            while (this.q > 0 && this.t < 9) {
                this.q *= this.r;
                this.a[this.t] = this.p = (this.q & 0xFFFF) * 10 >> 16;
                ++this.t;
                this.q >>= 16;
            }
            this.a = n2 == 0;
            if (this.a) {
                this.a[this.t] = 0;
            } else {
                --this.t;
            }
            this.u = 8 * this.t >> 1;
            while (this.t >= 0) {
                this.c(this.a[this.t], n3 + this.s - this.u, n4 - this.v, n5, 0);
                this.s += 8;
                --this.t;
            }
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        a.setClip(0, 0, 240, 320);
    }

    public final void d(int n2, int n3, int n4, int n5, int n6) {
        if (n6 > 12) {
            this.e(n2, n3 + 4, n4 + 4, com.mnemonicstudios.novusapp.n.Q, n6);
            return;
        }
        this.e(n2, n3, n4, n5, n6);
        this.e(n2, n3 + 2, n4 + 2, com.mnemonicstudios.novusapp.n.P, n6);
    }

    public final void e(int n2, int n3, int n4, int n5, int n6) {
        try {
            this.s = 0;
            this.q = Math.abs(n2);
            this.t = 0;
            while (this.q > 0 && this.t < 9) {
                this.q *= this.r;
                this.a[this.t] = this.p = (this.q & 0xFFFF) * 10 >> 16;
                ++this.t;
                this.q >>= 16;
            }
            this.a = n2 == 0;
            if (this.a) {
                this.a[this.t] = 0;
            } else {
                --this.t;
            }
            if (n2 < 0) {
                ++this.t;
                this.a[this.t] = 10;
            }
            this.u = n6 * this.t >> 1;
            while (this.t >= 0) {
                switch (com.mnemonicstudios.novusapp.j.c) {
                    case 0: {
                        this.a(this.a[this.t], n3 + this.s - this.u, n4 - this.v, n5, n6, 0);
                        break;
                    }
                    case 1: 
                    case 2: {
                        this.a(this.a[this.t], n3 - this.v, n4 + this.s - this.u, n5, n6, 5);
                    }
                }
                this.s += (n6 >> 1) + (n6 >> 2);
                --this.t;
            }
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        a.setClip(0, 0, 240, 320);
    }

    static {
        k = 1;
        o = 0;
        j = 0L;
        short[][] sArrayArray = new short[][]{{48, -1026, 507}, {-480, 485, 315}, {72, -1434, -236}, {-312, 1181, -524}, {336, -666, -1172}, {672, -162, 939}, {72, 1301, 723}, {Short.MAX_VALUE, Short.MAX_VALUE, Short.MAX_VALUE}};
        short[][] sArrayArray2 = new short[][]{{0, 1, 2, 0, 0}, {2, 1, 3, 0, 0}, {2, 3, 4, 0, 0}, {2, 5, 0, 0, 0}, {5, 6, 0, 0, 0}, {1, 0, 6, 0, 0}, {5, 2, 4, 0, 0}, {4, 3, 5, 0, 0}, {3, 1, 6, 0, 0}, {5, 5, 6, 0, 0}, {6, 5, 3, 0, 0}, {Short.MAX_VALUE, Short.MAX_VALUE, Short.MAX_VALUE}};
        int[] nArray = new int[]{0xFF0000, 0xC08000, 0xC00000, 0x804000, 0xFF0000, 0xC08000, 0xC00000, 0x804000, 0xFF0000, 0xC08000, 0xC00000, 0x804000, 0xFF0000, 0xC08000, 0xC00000, 0x804000, 0xFF0000, 0xC08000, 0xC00000, 0x804000, 0xFF0000, 0xC08000, 0xC00000, 0x804000, 0xFF0000, 0xC08000, 0xFF0000};
    }
}

