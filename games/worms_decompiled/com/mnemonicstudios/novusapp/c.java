/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.i;
import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.m;
import com.mnemonicstudios.novusapp.n;
import javax.microedition.lcdui.Graphics;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class c
extends m {
    static int[][] a = new int[256][7];
    static int[][] b = new int[256][7];
    static int[][] c = new int[256][4];
    static int[][] d = new int[256][4];
    static int a = 1;
    static int b;
    static int c;
    static int d;
    static final int[][] e;
    static final int[][] f;
    static boolean[] a;
    boolean a;
    boolean b = false;
    int e;
    int f;
    int g;
    int h = 24;
    boolean c = false;
    int i = 0;
    int j;
    int k = 128;
    int l = 64;
    int m;
    int n;
    int o = 0;
    int p = 0;
    int q;
    int r;
    static int s;
    static int t;
    static int u;
    static int v;
    int w;
    int x;
    int y;
    int z = 0;
    int A;
    int[][] g = new int[16][4];
    int B;
    int C = -1;
    long a = 0L;

    public final void a(boolean bl) {
        this.a = bl;
        this.i = 0;
        this.o = 0;
        this.p = 0;
        this.f = 99;
        this.g = 0;
        this.b = false;
        this.f();
        s = -1;
        for (d = 0; d < a.length; ++d) {
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][0] = 0;
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][1] = 0;
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][2] = 0;
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][3] = 0;
            com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][0] = 0;
            com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][1] = 0;
            com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][2] = 0;
            com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][3] = 0;
        }
        this.x = 0;
        while (this.x < d.length) {
            com.mnemonicstudios.novusapp.c.d[this.x][0] = -1;
            com.mnemonicstudios.novusapp.c.d[this.x][1] = 0;
            com.mnemonicstudios.novusapp.c.d[this.x][2] = -1;
            ++this.x;
        }
        this.j = 0;
        while (this.j < c.length) {
            com.mnemonicstudios.novusapp.c.c[this.j][0] = 0;
            com.mnemonicstudios.novusapp.c.c[this.j][1] = 0;
            com.mnemonicstudios.novusapp.c.c[this.j][2] = -1;
            ++this.j;
        }
        this.y = 0;
        while (this.y < f.length) {
            com.mnemonicstudios.novusapp.c.a[this.y] = false;
            ++this.y;
        }
        b = 120;
        c = 160;
        com.mnemonicstudios.novusapp.n.a.a();
    }

    public final void e() {
        if ((com.mnemonicstudios.novusapp.n.b() || com.mnemonicstudios.novusapp.n.h) && !this.b) {
            com.mnemonicstudios.novusapp.n.a.a(false);
        }
        if (this.b) {
            if (com.mnemonicstudios.novusapp.n.c()) {
                com.mnemonicstudios.novusapp.n.a.c(this.a);
            }
            ++this.e;
            return;
        }
        switch (a) {
            case 0: {
                break;
            }
            case 1: {
                if (com.mnemonicstudios.novusapp.n.i && (b -= 4) < 0) {
                    b = 0;
                }
                if (com.mnemonicstudios.novusapp.n.j && (b += 4) >= 240) {
                    b = 240;
                }
                if (com.mnemonicstudios.novusapp.n.k && (c -= 4) < 0) {
                    c = 0;
                }
                if (com.mnemonicstudios.novusapp.n.l && (c += 4) >= 320) {
                    c = 320;
                }
                if (com.mnemonicstudios.novusapp.n.m) {
                    ++this.g;
                    if (this.g > 2) {
                        this.g = 0;
                    }
                    if (this.f > 0) {
                        this.c = true;
                    }
                }
                if (com.mnemonicstudios.novusapp.n.m || !this.c) break;
                this.c = false;
                --this.f;
                this.a(this.g, b, c);
            }
        }
        this.c();
        this.a();
        this.d();
        com.mnemonicstudios.novusapp.n.a.a(512);
        if (t < 6) {
            this.b();
        }
        if (this.p < 3) {
            if (this.o > 20) {
                ++this.p;
                this.h = 24;
                this.f += 20;
                this.o = 0;
            }
        } else if (this.o > 50) {
            ++this.p;
            this.f += 10;
            this.o = 0;
        }
        if (this.a && this.p > 3) {
            this.b = true;
            this.e = 0;
        }
        if (s > 0) {
            --s;
        }
        if (s == 0) {
            this.e = 0;
            this.b = true;
        }
    }

    public final void b(Graphics graphics) {
        com.mnemonicstudios.novusapp.j.c = 0;
        com.mnemonicstudios.novusapp.j.a = 240;
        com.mnemonicstudios.novusapp.j.b = 320;
        graphics.setClip(0, 0, 240, 320);
        com.mnemonicstudios.novusapp.n.a.a(120, 160);
        com.mnemonicstudios.novusapp.n.a.a(graphics, -20);
        this.e(graphics);
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a, 512, 0);
        this.c(graphics);
        this.d(graphics);
        this.a(graphics);
        this.f(graphics);
        this.a(graphics, b, c);
        com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 54, 2, 16, 20, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.c(this.i, 24, 40, com.mnemonicstudios.novusapp.n.F);
        if (this.h > 0) {
            if ((this.h & 2) > 0) {
                com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 53, 120, 46, 17, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.c(this.p, 120, 70, com.mnemonicstudios.novusapp.n.F);
            }
            --this.h;
        }
        com.mnemonicstudios.novusapp.n.a.a(graphics, 210, 0, 2, 0, 1);
        com.mnemonicstudios.novusapp.n.a.c(this.f, 224, 40, com.mnemonicstudios.novusapp.n.F);
        if (this.b) {
            if (this.e < 16) {
                graphics.setColor(0);
                graphics.fillRect(0, 0, 240, this.e * 20);
            } else {
                graphics.setColor(0);
                graphics.fillRect(0, 0, 240, 320);
                com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 54, 120, 160, 17, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.c(this.i, 120, 184, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.a(graphics, -1, 0);
            }
        }
        this.g(graphics);
    }

    public final void a(int n2, int n3) {
        try {
            this.j = 0;
            while (this.j < c.length) {
                if (c[this.j][2] < 0) {
                    com.mnemonicstudios.novusapp.c.c[this.j][0] = n2;
                    com.mnemonicstudios.novusapp.c.c[this.j][1] = n3;
                    com.mnemonicstudios.novusapp.c.c[this.j][2] = 0;
                    return;
                }
                ++this.j;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void a() {
        this.j = 0;
        while (this.j < c.length) {
            if (c[this.j][2] >= 0) {
                int[] nArray = c[this.j];
                nArray[2] = nArray[2] + 1;
                if (c[this.j][2] > this.k) {
                    com.mnemonicstudios.novusapp.c.c[this.j][2] = -3;
                }
            }
            ++this.j;
        }
    }

    public final void a(Graphics graphics) {
        this.j = 0;
        while (this.j < c.length) {
            if (c[this.j][2] >= 0) {
                if (c[this.j][2] < this.l) {
                    graphics.setColor(255, 0, 0);
                    graphics.fillArc(c[this.j][0] - (c[this.j][2] >> 1) - 3, c[this.j][1] - (c[this.j][2] >> 1) - 3, c[this.j][2] + 6, c[this.j][2] + 6, 0, 360);
                } else {
                    graphics.setColor(255, 0, 0);
                    graphics.fillArc(c[this.j][0] - (this.l - (c[this.j][2] >> 1)) - 3, c[this.j][1] - (this.l - (c[this.j][2] >> 1)) - 3, this.k - c[this.j][2] + 6, this.k - c[this.j][2] + 6, 0, 360);
                }
            }
            ++this.j;
        }
        this.j = 0;
        while (this.j < c.length) {
            if (c[this.j][2] >= 0) {
                if (c[this.j][2] < this.l) {
                    graphics.setColor(255, 255, 0);
                    graphics.fillArc(c[this.j][0] - (c[this.j][2] >> 1), c[this.j][1] - (c[this.j][2] >> 1), c[this.j][2], c[this.j][2], 0, 360);
                } else {
                    graphics.setColor(255, 255, 0);
                    graphics.fillArc(c[this.j][0] - (this.l - (c[this.j][2] >> 1)), c[this.j][1] - (this.l - (c[this.j][2] >> 1)), this.k - c[this.j][2], this.k - c[this.j][2], 0, 360);
                }
            }
            ++this.j;
        }
    }

    public final void a(int n2, int n3, int n4) {
        this.x = 0;
        while (this.x < d.length) {
            if (d[this.x][2] < 0) {
                com.mnemonicstudios.novusapp.c.d[this.x][0] = n3;
                com.mnemonicstudios.novusapp.c.d[this.x][1] = n4;
                com.mnemonicstudios.novusapp.c.d[this.x][2] = n2;
                if (!this.a(this.x)) {
                    com.mnemonicstudios.novusapp.c.d[this.x][0] = 0;
                    com.mnemonicstudios.novusapp.c.d[this.x][1] = 0;
                    com.mnemonicstudios.novusapp.c.d[this.x][2] = -1;
                }
                return;
            }
            ++this.x;
        }
    }

    public final boolean a(int n2) {
        try {
            for (d = 0; d < a.length; ++d) {
                if (b[d][3] != 0) continue;
                this.m = d[n2][0] - e[d[n2][2]][0];
                this.n = -(d[n2][1] - e[d[n2][2]][1]);
                if (this.n <= 0) {
                    return false;
                }
                com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][3] = -131072;
                com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][2] = (this.m << 17) / this.n;
                com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][0] = e[d[n2][2]][0] << 16;
                com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][1] = e[d[n2][2]][1] << 16;
                com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][4] = d[n2][0];
                com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][5] = d[n2][1];
                com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][6] = n2;
                return true;
            }
            return false;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return false;
        }
    }

    public final void b() {
        for (d = 0; d < a.length; ++d) {
            if (a[d][3] != 0) continue;
            this.q = com.mnemonicstudios.novusapp.n.a(240);
            this.r = com.mnemonicstudios.novusapp.n.a(5);
            this.m = f[this.r][0] - this.q;
            this.n = f[this.r][1];
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][3] = 65536;
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][2] = (this.m << 16) / this.n;
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][0] = this.q << 16;
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][1] = 0;
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][4] = f[this.r][0];
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][5] = f[this.r][1];
            com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][6] = this.r;
            ++this.o;
            return;
        }
    }

    public final void c() {
        try {
            t = 0;
            u = 0;
            for (d = 0; d < a.length; ++d) {
                if (a[d][3] != 0) {
                    ++t;
                    int[] nArray = a[d];
                    nArray[0] = nArray[0] + a[d][2];
                    int[] nArray2 = a[d];
                    nArray2[1] = nArray2[1] + a[d][3];
                    this.m = Math.abs(a[d][4] - (a[d][0] >> 16));
                    this.n = Math.abs(a[d][5] - (a[d][1] >> 16));
                    if (this.m < 4 && this.n < 4) {
                        com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][3] = 0;
                        this.a(a[d][4], a[d][5]);
                        com.mnemonicstudios.novusapp.n.a(1);
                        this.b(a[d][4], a[d][5]);
                        s = 32;
                    } else if (com.mnemonicstudios.novusapp.n.a(10) > 6) {
                        com.mnemonicstudios.novusapp.j.g(a[d][0] >> 16, a[d][1] >> 16);
                    }
                    this.j = 0;
                    while (this.j < c.length) {
                        if (c[this.j][2] >= 0) {
                            this.m = Math.abs(c[this.j][0] - (a[d][0] >> 16)) - 8;
                            this.n = Math.abs(c[this.j][1] - (a[d][1] >> 16)) - 8;
                            v = this.m * this.m + this.n * this.n;
                            if (c[this.j][2] < this.l) {
                                if (v < (c[this.j][2] >> 1) * (c[this.j][2] >> 1)) {
                                    com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][3] = 0;
                                    this.i += 73;
                                    this.b(a[d][0] >> 16, a[d][1] >> 16);
                                }
                            } else if (v < (this.k - c[this.j][2] >> 1) * (this.k - c[this.j][2] >> 1)) {
                                com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][3] = 0;
                                this.i += 73;
                                this.b(a[d][0] >> 16, a[d][1] >> 16);
                            }
                        }
                        ++this.j;
                    }
                    if (a[d][0] >> 16 < 0 && a[d][0] >> 16 > 240) {
                        com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][3] = 0;
                    } else if (a[d][0] >> 16 < 0 && a[d][0] >> 16 > 240) {
                        com.mnemonicstudios.novusapp.c.a[com.mnemonicstudios.novusapp.c.d][3] = 0;
                    }
                }
                if (b[d][3] == 0) continue;
                ++u;
                int[] nArray = b[d];
                nArray[0] = nArray[0] + b[d][2];
                int[] nArray3 = b[d];
                nArray3[1] = nArray3[1] + b[d][3];
                this.m = Math.abs(b[d][4] - (b[d][0] >> 16));
                this.n = Math.abs(b[d][5] - (b[d][1] >> 16));
                if (this.m < 6 && this.n < 6) {
                    com.mnemonicstudios.novusapp.c.d[com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][6]][2] = -1;
                    com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][3] = 0;
                    this.a(b[d][4], b[d][5]);
                    this.b(b[d][4], b[d][5]);
                } else if (com.mnemonicstudios.novusapp.n.a(10) > 6) {
                    com.mnemonicstudios.novusapp.j.g(b[d][0] >> 16, b[d][1] >> 16);
                }
                if (b[d][0] >> 16 < 0 && b[d][0] >> 16 > 240) {
                    com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][3] = 0;
                    continue;
                }
                if (b[d][0] >> 16 >= 0 || b[d][0] >> 16 <= 240) continue;
                com.mnemonicstudios.novusapp.c.b[com.mnemonicstudios.novusapp.c.d][3] = 0;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void c(Graphics graphics) {
        for (d = 0; d < a.length; ++d) {
            if (a[d][3] != 0) {
                this.w = (1152 + com.mnemonicstudios.novusapp.i.a(a[d][2], a[d][3]) & 0xFFF) >> 8;
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.l, a[d][0] >> 16, (a[d][1] >> 16) + 6, this.w, 0);
            }
            if (b[d][3] == 0) continue;
            this.w = (1152 + com.mnemonicstudios.novusapp.i.a(b[d][2], b[d][3]) & 0xFFF) >> 8;
            com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.l, b[d][0] >> 16, (b[d][1] >> 16) + 6, this.w, 0);
        }
    }

    public final void a(Graphics graphics, int n2, int n3) {
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.i, n2, n3 + 10, 0, 0);
    }

    public final void d(Graphics graphics) {
        this.x = 0;
        while (this.x < d.length) {
            if (d[this.x][2] >= 0) {
                graphics.setColor(255, 0, 0);
                graphics.drawRect(d[this.x][0] - 4, d[this.x][1] - 4, 8, 8);
            }
            ++this.x;
        }
    }

    public final void d() {
        this.y = 0;
        while (this.y < f.length) {
            this.j = 0;
            while (this.j < c.length) {
                if (c[this.j][2] >= 0) {
                    this.m = Math.abs(c[this.j][0] - f[this.y][0]);
                    this.n = Math.abs(c[this.j][1] - f[this.y][1]);
                    v = this.m * this.m + this.n * this.n;
                    if (c[this.j][2] < this.l) {
                        if (v < c[this.j][2] * c[this.j][2]) {
                            com.mnemonicstudios.novusapp.c.a[this.y] = true;
                        }
                    } else if (v < (this.k - c[this.j][2]) * (this.k - c[this.j][2])) {
                        com.mnemonicstudios.novusapp.c.a[this.y] = true;
                    }
                }
                ++this.j;
            }
            ++this.y;
        }
    }

    public final void e(Graphics graphics) {
        this.A = (1152 - com.mnemonicstudios.novusapp.i.a(b - f[0][0], c - f[0][1]) & 0xFFF) / 228;
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.e[this.z], f[0][0], f[0][1], this.A, 0);
        this.A = (1152 - com.mnemonicstudios.novusapp.i.a(b - f[1][0], c - f[1][1]) & 0xFFF) / 228;
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.e[this.z], f[1][0], f[1][1], this.A, 0);
        this.A = (1152 - com.mnemonicstudios.novusapp.i.a(b - f[2][0], c - f[2][1]) & 0xFFF) / 228;
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.e[this.z], f[2][0], f[2][1], this.A, 0);
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a[this.z], f[3][0] - 4, f[3][1] - 11, 0, 0);
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.w, f[3][0], f[3][1], 1, 0);
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a[this.z], f[4][0] + 2, f[4][1] - 11, 0, 1);
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.w, f[4][0], f[4][1], 0, 0);
    }

    public final void f() {
        this.j = 0;
        while (this.j < this.g.length) {
            this.g[this.j][2] = -1;
            ++this.j;
        }
    }

    public final void b(int n2, int n3) {
        try {
            this.B = 0;
            while (this.B < this.g.length) {
                if (this.g[this.B][2] < 0) {
                    this.g[this.B][0] = n2;
                    this.g[this.B][1] = n3;
                    this.g[this.B][2] = 0;
                    return;
                }
                ++this.B;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void f(Graphics graphics) {
        try {
            this.j = 0;
            while (this.j < this.g.length) {
                if (this.g[this.j][2] >= 0) {
                    if (this.g[this.j][2] == 1) {
                        com.mnemonicstudios.novusapp.j.h(this.g[this.j][0], this.g[this.j][1], 32);
                    }
                    if (this.g[this.j][2] < 3) {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.k, this.g[this.j][0], this.g[this.j][1] + 32, this.g[this.j][2], 0);
                    } else {
                        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.k, this.g[this.j][0], this.g[this.j][1] + 32, 5 - this.g[this.j][2], 0);
                    }
                    int[] nArray = this.g[this.j];
                    nArray[2] = nArray[2] + 1;
                    if (this.g[this.j][2] > 5) {
                        this.g[this.j][2] = -1;
                    }
                }
                ++this.j;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void g(Graphics graphics) {
        if (this.b) {
            return;
        }
        if (System.currentTimeMillis() - this.a > 1000L) {
            this.C = 128;
        }
        this.a = System.currentTimeMillis();
        if (this.C < 0) {
            return;
        }
        --this.C;
        if (this.C > 32 || (this.C & 2) != 0) {
            com.mnemonicstudios.novusapp.n.a.a(graphics, 204, 284, 0, 0, 1);
            graphics.setColor(0);
            graphics.fillRect(206, 286, 24, 24);
            graphics.setColor(255, 0, 0);
            graphics.fillRect(210, 290, 5, 16);
            graphics.fillRect(221, 290, 5, 16);
        }
    }

    static {
        e = new int[][]{{16, 288}, {120, 296}, {224, 272}};
        f = new int[][]{{16, 288}, {120, 296}, {224, 272}, {60, 308}, {180, 308}};
        a = new boolean[f.length];
        s = -1;
    }
}

