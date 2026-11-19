/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.n;
import com.mnemonicstudios.novusapp.o;
import com.mnemonicstudios.novusapp.p;
import com.mnemonicstudios.novusapp.r;
import javax.microedition.lcdui.Graphics;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class d {
    public static int[] a = new int[20];
    public static boolean a;
    public int a = -1;
    public boolean b;
    public static int b;
    public int[] b = new int[16];
    private int d;
    int c;

    public final void a(int n2) {
        p.a(4, 16, 232, 272);
        if (n2 == 13) {
            p.a(6, 0);
            return;
        }
        p.a(56 + (n2 - 1), 0);
    }

    public final void a(Graphics graphics, int n2, int n3) {
        graphics.setClip(0, 0, 240, 320);
        if (this.a != n2) {
            this.a(n2);
            this.a = n2;
        }
        p.a();
        p.a(graphics);
    }

    public final boolean a(int n2, boolean bl) {
        if (n2 < 1 || n2 > 13) {
            return false;
        }
        this.b = false;
        this.b[0] = 1;
        this.b[7] = n2;
        if (bl) {
            switch (this.b[7]) {
                case 1: {
                    return this.a(b, 1, 1, 0, 0);
                }
                case 2: {
                    return this.a(b, 2, 3, 0, 0);
                }
                case 3: {
                    return this.a(b, 0, 3, 3, 0);
                }
                case 4: {
                    return this.a(b, 0, 3, 0, 0);
                }
                case 5: {
                    return this.a(b, 0, 3, 0, 0);
                }
                case 6: {
                    return this.a(b, 2, 3, 0, 0);
                }
                case 7: {
                    return this.a(b, 2, 3, 0, 0);
                }
                case 8: {
                    return this.a(b, 0, 3, 0, 0);
                }
                case 9: {
                    return this.a(b, 2, 3, 0, 0);
                }
                case 10: {
                    return this.a(b, 2, 3, 0, 0);
                }
                case 11: {
                    return this.a(b, 0, 3, 3, 0);
                }
                case 12: {
                    return this.a(b, 2, 1, 0, 0);
                }
                case 13: {
                    return this.a(b, 2, 1, 0, 0);
                }
            }
        } else {
            int n3;
            int n4;
            if (this.b[7] < 4) {
                n.a.a(0, 2, -1);
                n.a.a(0, 8, 1);
                n.a.a(0, 1, 1);
                n.a.a(0, 3, 0);
                n.a.a(0, 7, 0);
                n.a.a(0, 9, 0);
                n.a.a(0, 6, 0);
                n.a.a(0, 5, 0);
                n.a.a(0, 12, 0);
                n.a.a(0, 11, 0);
                n.a.a(0, 13, 0);
                n.a.a(0, 4, 0);
                n.a.a(0, 14, 0);
            } else if (this.b[7] < 9) {
                n.a.a(0, 2, -1);
                n.a.a(0, 8, 1);
                n.a.a(0, 1, 1);
                n.a.a(0, 3, 2);
                n.a.a(0, 7, 1);
                n.a.a(0, 9, 1);
                n.a.a(0, 6, 1);
                n.a.a(0, 5, 1);
                n.a.a(0, 12, 0);
                n.a.a(0, 11, 0);
                n.a.a(0, 13, 0);
                n.a.a(0, 4, 1);
                n.a.a(0, 14, 1);
            } else {
                n4 = this.b[7] == 13 ? 4 : 1;
                for (n3 = 0; n3 < n4; ++n3) {
                    if (n3 > 0 && o.b[n3] != 0) continue;
                    n.a.a(n3, 2, -1);
                    n.a.a(n3, 8, 2);
                    n.a.a(n3, 1, 4);
                    n.a.a(n3, 3, 2);
                    n.a.a(n3, 7, 2);
                    n.a.a(n3, 9, 2);
                    n.a.a(n3, 6, 2);
                    n.a.a(n3, 5, 1);
                    n.a.a(n3, 12, 2);
                    n.a.a(n3, 11, 1);
                    n.a.a(n3, 13, 4);
                    n.a.a(n3, 4, 2);
                    n.a.a(n3, 14, 4);
                }
            }
            if (this.b[7] == 4 || this.b[7] == 5 || this.b[7] == 9) {
                n.a.a(0, 9, 0);
            }
            switch (this.b[7]) {
                case 1: {
                    n.a.a(2, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 4, false, 33);
                    this.a(1, 2);
                    this.b[11] = this.a(5, 3, 100);
                    break;
                }
                case 2: {
                    n.a.a(2, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 4, false, 33);
                    this.a(1, 3);
                    this.b[11] = this.a(5, 3, 50);
                    break;
                }
                case 3: {
                    n.a.a(2, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 4, false, 40);
                    this.a(1, 2);
                    break;
                }
                case 4: {
                    n.a.a(2, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 4, false, 50);
                    this.a(1, 1);
                    this.c(7, 10);
                    break;
                }
                case 5: {
                    n.a.a(2, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 4, false, 75);
                    this.a(1, 3);
                    this.c(7, 10);
                    break;
                }
                case 6: {
                    n.a.a(3, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 3, false, 100);
                    this.a(1, 3);
                    this.a(2, 3, false, 100);
                    this.a(2, 2);
                    this.b[11] = this.a(5, 3, 50);
                    break;
                }
                case 7: {
                    n.a.a(2, 4, 0, 1, -1, -1);
                    this.a(0, 1, true, 100);
                    this.a(0, 0);
                    this.a(1, 4, false, 100);
                    this.a(1, 2);
                    break;
                }
                case 8: {
                    n.a.a(2, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 3, false, 100);
                    this.a(1, 3);
                    this.b[11] = this.a(8, 3, 50);
                    break;
                }
                case 9: {
                    n.a.a(3, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 3, false, 100);
                    this.a(1, 1);
                    this.a(1, 3, false, 100);
                    this.a(2, 2);
                    this.c(7, 8);
                    break;
                }
                case 10: {
                    n.a.a(2, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 3, false, 100);
                    this.a(1, 3);
                    this.d(9, 4);
                    this.a(0, 6, 4);
                    break;
                }
                case 11: {
                    n.a.a(2, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 3, false, 100);
                    this.a(1, 2);
                    this.a(0, 13, 8);
                    this.b[11] = this.a(8, 3, 100);
                    break;
                }
                case 12: {
                    n.a.a(4, 4, 0, 1, -1, -1);
                    this.a(0, 4, true, 100);
                    this.a(0, 0);
                    this.a(1, 3, false, 100);
                    this.a(1, 2);
                    this.a(2, 3, false, 100);
                    this.a(2, 3);
                    this.a(3, 3, false, 100);
                    this.a(3, 1);
                    break;
                }
                case 13: {
                    n.a.a(o.a(), 4, 0, 1, -1, -1);
                    n4 = 0;
                    for (n3 = 0; n3 < o.b.length; ++n3) {
                        if (o.b[n3] == 1 || o.b[n3] != 0) continue;
                        this.a(n4, 4, o.b[n3] == 0, 100);
                        this.a(n4, n3);
                        ++n4;
                    }
                    for (n3 = 0; n3 < o.b.length; ++n3) {
                        if (o.b[n3] == 1 || o.b[n3] == 0) continue;
                        this.a(n4, 4, o.b[n3] == 0, 100);
                        this.a(n4, n3);
                        ++n4;
                    }
                    break;
                }
            }
            this.b[1] = 0;
        }
        return true;
    }

    public final void a() {
        this.a = -1;
        this.b[1] = 1;
        n.a.m();
    }

    public final boolean a() {
        return this.b[7] == 13;
    }

    public final void b() {
        if (this.b[1] != 1) {
            return;
        }
        if (this.b[0] == 1) {
            if (this.b[7] != 13 && this.a() == 0) {
                this.a(false, 1);
                return;
            }
            switch (this.b[7]) {
                case 1: {
                    if (this.a(this.b[11]) <= 0) {
                        this.a(false, 1);
                        return;
                    }
                    if (this.b() != 0) break;
                    this.a(true, 0);
                    return;
                }
                case 2: {
                    if (this.a(this.b[11]) <= 0) {
                        this.a(false, 1);
                        return;
                    }
                    if (this.a(this.b[11]) < 100 && this.b() != 0) break;
                    this.a(true, 0);
                    return;
                }
                case 3: {
                    if (this.b() != 0) break;
                    this.a(true, 0);
                    return;
                }
                case 4: {
                    if (this.b(7) < 5) break;
                    this.a(true, 0);
                    return;
                }
                case 5: {
                    if (this.c(7) > 0) break;
                    this.a(true, 0);
                    return;
                }
                case 6: {
                    if (this.a(this.b[11]) <= 0) {
                        this.a(false, 1);
                        return;
                    }
                    if (this.a(this.b[11]) < 100) break;
                    this.a(true, 0);
                    return;
                }
                case 7: {
                    if (this.b() != 0) break;
                    this.a(true, 0);
                    return;
                }
                case 8: {
                    if (this.b() == 0) {
                        this.a(true, 0);
                        return;
                    }
                    if (this.a(this.b[11]) > 0) break;
                    this.a(false, 1);
                    return;
                }
                case 9: {
                    if (this.b(7) >= 5) {
                        if (this.b() != 0) break;
                        this.a(true, 0);
                        return;
                    }
                    if (this.c(7) + this.b(7) >= 5) break;
                    this.a(false, 1);
                    return;
                }
                case 10: {
                    if (this.d(9) != 0) break;
                    this.a(true, 0);
                    return;
                }
                case 11: {
                    if (this.b() == 0) {
                        this.a(true, 0);
                        return;
                    }
                    if (this.a(this.b[11]) > 0) break;
                    this.a(false, 1);
                    return;
                }
                case 12: {
                    if (this.b() != 0) break;
                    this.a(true, 0);
                    return;
                }
                case 13: {
                    if (this.c() > 1) break;
                    this.a(true, 0);
                }
            }
        }
    }

    public final void c() {
        if (this.b[0] == 1) {
            switch (this.b[7]) {
                case 1: {
                    return;
                }
                case 2: {
                    this.d = 10 * this.a(this.b[11], 48);
                    this.b(this.b[11], this.d);
                    return;
                }
                case 3: {
                    return;
                }
                case 4: {
                    return;
                }
                case 5: {
                    return;
                }
                case 6: {
                    this.d = this.b() == 0 ? 100 : 10 * this.a(this.b[11], 48);
                    this.b(this.b[11], this.d);
                }
            }
        }
    }

    public final boolean b() {
        return this.b[1] != 3;
    }

    public final void d() {
        this.b = false;
    }

    public final void a(boolean bl, int n2) {
        if (this.b[1] == 3) {
            return;
        }
        this.b[1] = 2;
        this.b = bl;
        if (this.b) {
            if (a[this.b[7]] < r.c[0]) {
                com.mnemonicstudios.novusapp.d.a[this.b[7]] = r.c[0];
                a = true;
            } else {
                a = false;
            }
        } else {
            a = false;
        }
        this.b[1] = 3;
    }

    private boolean a(int n2, int n3, boolean bl, int n4) {
        n.a.a(n2, n3, bl, n4);
        return true;
    }

    private void a(int n2, int n3) {
        n.a.d(n2, n3);
    }

    private int a(int n2, int n3) {
        return n.a.a(n2, n3);
    }

    private int a() {
        return n.a.a();
    }

    private int b() {
        return n.a.c();
    }

    private int c() {
        return n.a.b();
    }

    private boolean a(int n2, int n3, int n4, int n5, int n6) {
        return n.a.a(n2, n3, n4, n5, n6);
    }

    private int a(int n2, int n3, int n4) {
        return n.a.a(n2, n3, n4);
    }

    private void b(int n2, int n3) {
        n.a.b(n2, n3);
    }

    private int a(int n2) {
        return n.a.d(n2);
    }

    private void c(int n2, int n3) {
        n.a.a(n2, n3);
    }

    private int b(int n2) {
        return n.a.a(n2);
    }

    private int c(int n2) {
        return n.a.b(n2);
    }

    private void d(int n2, int n3) {
        this.c = 0;
        while (this.c < n3) {
            n.a.a(n2, 0, 100);
            ++this.c;
        }
    }

    private int d(int n2) {
        return n.a.b(n2);
    }

    private void a(int n2, int n3, int n4) {
        n.a.a(n2, n3, n4);
    }
}

