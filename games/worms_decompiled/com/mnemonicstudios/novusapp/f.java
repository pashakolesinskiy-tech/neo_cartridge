/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 *  javax.microedition.lcdui.Image
 *  javax.microedition.lcdui.game.Sprite
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.i;
import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.m;
import com.mnemonicstudios.novusapp.n;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class f
extends m {
    static int a = 1;
    static int b;
    static int c;
    static int d;
    static int e;
    boolean a;
    int f;
    int g = 24;
    boolean b = false;
    int h = 1024;
    int i = 65536;
    int j = 0;
    int k = 0;
    int l = 0;
    int m = 0;
    int n = 0;
    int o = 0;
    int p = 0;
    int q = 0;
    int r = 0;
    int s = 0;
    int t;
    int u;
    int v;
    int w = 6;
    int x = 3;
    int y;
    int z;
    int[][] a;
    int A = 0;
    int B = 0;
    boolean c = false;
    int C;
    int D;
    int E;
    int F;
    int G;
    int H;
    int I;
    int J;
    int K = 0;
    boolean d = false;
    int L;
    int M = -1;
    long a = 0L;

    public final void a(boolean bl) {
        com.mnemonicstudios.novusapp.n.a.a();
        this.a = bl;
        this.f = 0;
        com.mnemonicstudios.novusapp.n.a.i();
        com.mnemonicstudios.novusapp.j.bM = 0;
        d = 1;
        e = 3;
        this.s = 0;
        this.r = 0;
        this.h = 1024;
        this.i = 65536;
        this.j = 0x2000000;
        this.k = 0;
        this.l = 0;
        this.m = 0;
        this.n = 0;
        this.o = 0;
        this.d = false;
        com.mnemonicstudios.novusapp.j.bL = 1;
        com.mnemonicstudios.novusapp.n.a.ah = 4;
        try {
            com.mnemonicstudios.novusapp.n.a.a = null;
            com.mnemonicstudios.novusapp.n.a.b = null;
            com.mnemonicstudios.novusapp.n.a.c = null;
            Thread.sleep(250L);
            com.mnemonicstudios.novusapp.n.a.b = Image.createImage((String)"/landscape2_backdrop.png");
            com.mnemonicstudios.novusapp.n.a.a = new Sprite(com.mnemonicstudios.novusapp.n.a.b, com.mnemonicstudios.novusapp.n.a.b.getWidth(), com.mnemonicstudios.novusapp.n.a.b.getHeight());
            com.mnemonicstudios.novusapp.n.a.c = Image.createImage((String)"/worms_landscape2cap.png");
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        this.b = false;
        com.mnemonicstudios.novusapp.n.a.a(0);
    }

    public final boolean a() {
        if (!this.b) {
            com.mnemonicstudios.novusapp.n.a.d();
            this.b = true;
        }
        return com.mnemonicstudios.novusapp.n.a.a();
    }

    public final void a(Graphics graphics) {
        graphics.setColor(0xFF0000);
        if (this.h > 128) {
            graphics.setColor(0xA00000);
        }
        if (this.h > 256) {
            graphics.setColor(0xA0A000);
        }
        if (this.h > 512) {
            graphics.setColor(40960);
        }
        graphics.fillRect(4, 8 + (304 * (1024 - this.h) >> 10), 4, 304 * this.h >> 10);
        graphics.drawRect(4, 8, 4, 303);
    }

    public final void e() {
        if ((com.mnemonicstudios.novusapp.n.b() || com.mnemonicstudios.novusapp.n.h) && !this.d) {
            com.mnemonicstudios.novusapp.n.a.a(false);
        }
        if (this.d) {
            if (com.mnemonicstudios.novusapp.n.c()) {
                com.mnemonicstudios.novusapp.n.a.c(this.a);
            }
            ++this.L;
            return;
        }
        switch (a) {
            case 3: {
                com.mnemonicstudios.novusapp.n.a.a(512);
                com.mnemonicstudios.novusapp.n.a.s();
                com.mnemonicstudios.novusapp.n.a.k();
                --this.q;
                if (this.q > 0) break;
                this.f += this.h;
                a = 1;
                this.j = 0x2000000;
                this.k = 0;
                this.l = 0;
                this.m = 0;
                this.n = 0;
                this.o = 0;
                this.h = 1024;
                this.g = 24;
                if (++d > 2) {
                    this.s += 3;
                }
                if (this.a && d > 4) {
                    this.d = true;
                    this.L = 0;
                }
                this.r = com.mnemonicstudios.novusapp.n.a(this.s << 1) - this.s;
                if (this.r > 100) {
                    this.r = 100;
                }
                if (this.r < -100) {
                    this.r = -100;
                }
                com.mnemonicstudios.novusapp.n.a.b(this.r);
                break;
            }
            case 2: {
                com.mnemonicstudios.novusapp.n.a.a(512);
                com.mnemonicstudios.novusapp.n.a.s();
                com.mnemonicstudios.novusapp.n.a.k();
                --this.p;
                if (this.p > 0) break;
                a = 1;
                this.j = 0x2000000;
                this.k = 0;
                this.l = 0;
                this.m = 0;
                this.n = 0;
                this.o = 0;
                this.h = 1024;
                if (--e != 0) break;
                this.L = 0;
                this.d = true;
                break;
            }
            case 0: {
                break;
            }
            case 1: {
                this.i = 8192;
                this.j += this.l;
                this.k += this.m;
                if (this.j >> 16 > 1023) {
                    this.j = 0x3FF0000;
                }
                if (this.j < 0) {
                    this.j = 0;
                }
                if (this.k >> 16 > 511) {
                    this.k = 0x1FF0000;
                    com.mnemonicstudios.novusapp.n.a.g(this.j >> 16, this.k >> 16, 32);
                    this.p = 100;
                    a = 2;
                    this.C = 120;
                    this.D = 160;
                    this.E = 120;
                    this.F = 160;
                    this.G = com.mnemonicstudios.novusapp.n.a(8) - 4;
                    this.H = com.mnemonicstudios.novusapp.n.a(8) - 4;
                    this.J = -10;
                    this.I = -6;
                }
                if (this.k < 0) {
                    this.k = 0;
                }
                this.m += this.i;
                if (this.m >> 16 > 8) {
                    this.m = 524288;
                }
                this.l += this.r << 9;
                if (this.l >> 16 < -8) {
                    this.l = -524288;
                }
                if (this.l >> 16 > 8) {
                    this.l = 524288;
                }
                this.n = this.j;
                this.o = this.k;
                if (this.a(0, b, c)) {
                    if (Math.abs(this.m >> 15) > 1 || Math.abs(this.l >> 18) > 1) {
                        com.mnemonicstudios.novusapp.n.a.g(this.j >> 16, this.k >> 16, 32);
                        com.mnemonicstudios.novusapp.n.a(1);
                        this.p = 64;
                        a = 2;
                        this.C = 120;
                        this.D = 160;
                        this.E = 120;
                        this.F = 160;
                        this.G = com.mnemonicstudios.novusapp.n.a(8) - 4;
                        this.H = com.mnemonicstudios.novusapp.n.a(8) - 4;
                        this.J = -10;
                        this.I = -6;
                    } else {
                        this.q = 64;
                        a = 3;
                        com.mnemonicstudios.novusapp.n.a(5);
                    }
                }
                if (com.mnemonicstudios.novusapp.n.a.a(this.n >> 16, this.o >> 16, this.j >> 16, this.k >> 16)) {
                    this.j = com.mnemonicstudios.novusapp.n.a.ak << 16;
                    this.k = com.mnemonicstudios.novusapp.n.a.al << 16;
                    this.n = com.mnemonicstudios.novusapp.n.a.ak << 16;
                    this.o = com.mnemonicstudios.novusapp.n.a.al << 16;
                    this.l >>= 1;
                    this.m >>= 1;
                    com.mnemonicstudios.novusapp.n.a.g(com.mnemonicstudios.novusapp.n.a.ak, com.mnemonicstudios.novusapp.n.a.al, 32);
                    this.p = 64;
                    a = 2;
                    com.mnemonicstudios.novusapp.n.a(1);
                    this.C = 120;
                    this.D = 160;
                    this.E = 120;
                    this.F = 160;
                    this.G = com.mnemonicstudios.novusapp.n.a(8) - 4;
                    this.H = com.mnemonicstudios.novusapp.n.a(8) - 4;
                    this.J = -10;
                    this.I = -6;
                }
                if (com.mnemonicstudios.novusapp.n.i && this.h > 0) {
                    this.h -= 4;
                    this.l -= 16384;
                    if (this.l >> 16 < -8) {
                        this.l = -524288;
                    }
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (this.j >> 16) + com.mnemonicstudios.novusapp.n.a(8), (this.k >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), 262144, com.mnemonicstudios.novusapp.n.a(4) - 2 << 15, 20, 0);
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (this.j >> 16) + com.mnemonicstudios.novusapp.n.a(8), (this.k >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), 262144, com.mnemonicstudios.novusapp.n.a(4) - 2 << 15, 20, 0);
                }
                if (com.mnemonicstudios.novusapp.n.j && this.h > 0) {
                    this.h -= 4;
                    this.l += 16384;
                    if (this.l >> 16 > 8) {
                        this.l = 524288;
                    }
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (this.j >> 16) - com.mnemonicstudios.novusapp.n.a(8), (this.k >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), -262144, com.mnemonicstudios.novusapp.n.a(4) - 2 << 15, 20, 0);
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (this.j >> 16) - com.mnemonicstudios.novusapp.n.a(8), (this.k >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), -262144, com.mnemonicstudios.novusapp.n.a(4) - 2 << 15, 20, 0);
                }
                if (com.mnemonicstudios.novusapp.n.k && this.h > 0) {
                    this.h -= 8;
                    this.m -= 16384;
                    if (this.m >> 16 < -8) {
                        this.m = -524288;
                    }
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (this.j >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), (this.k >> 16) + com.mnemonicstudios.novusapp.n.a(8), com.mnemonicstudios.novusapp.n.a(4) - 2 << 15, 262144, 20, 0);
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (this.j >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), (this.k >> 16) + com.mnemonicstudios.novusapp.n.a(8), com.mnemonicstudios.novusapp.n.a(4) - 2 << 15, 262144, 20, 0);
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (this.j >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), (this.k >> 16) + com.mnemonicstudios.novusapp.n.a(8), com.mnemonicstudios.novusapp.n.a(4) - 2 << 15, 262144, 20, 0);
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.j.bF, (this.j >> 16) + (com.mnemonicstudios.novusapp.n.a(8) - 4), (this.k >> 16) + com.mnemonicstudios.novusapp.n.a(8), com.mnemonicstudios.novusapp.n.a(4) - 2 << 15, 262144, 20, 0);
                }
                if (com.mnemonicstudios.novusapp.n.m) {
                    this.c = true;
                }
                if (com.mnemonicstudios.novusapp.n.m || !this.c) break;
                this.c = false;
            }
        }
        com.mnemonicstudios.novusapp.n.a.a(512);
        com.mnemonicstudios.novusapp.n.a.s();
        com.mnemonicstudios.novusapp.n.a.k();
    }

    public final void a(int n2, int n3, int n4) {
        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.L, n2, n3 + 32, 0, 0);
        this.t = 1;
        while (this.t < n4) {
            com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.L, n2 + (this.t << 5), n3 + 32, 1, 0);
            ++this.t;
        }
        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.L, n2 + (this.t << 5), n3 + 32, 2, 0);
    }

    public final boolean a(int n2, int n3, int n4) {
        return n3 > this.a[n2][0] && n3 < this.a[n2][0] + this.a[n2][2] && n4 > this.a[n2][1] && n4 < this.a[n2][1] + this.a[n2][3];
    }

    public final void a(Graphics graphics, int n2, int n3, int n4) {
        graphics.setColor(40960);
        graphics.drawLine(n2 - n4, n3 + n4, n2 - n4, n3 - n4);
        graphics.drawLine(n2 - n4, n3 + n4, n2 + n4, n3 + n4);
        this.u = n4 >> 4;
        this.v = 0;
        while (this.v < n4 << 1) {
            graphics.drawLine(n2 - n4 - this.w, n3 - n4 + this.v, n2 - n4, n3 - n4 + this.v);
            graphics.drawLine(n2 - n4 + this.v, n3 + n4 + this.w, n2 - n4 + this.v, n3 + n4);
            this.v += this.u;
            graphics.drawLine(n2 - n4 - this.x, n3 - n4 + this.v, n2 - n4, n3 - n4 + this.v);
            graphics.drawLine(n2 - n4 + this.v, n3 + n4 + this.x, n2 - n4 + this.v, n3 + n4);
            this.v += this.u;
            graphics.drawLine(n2 - n4 - this.x, n3 - n4 + this.v, n2 - n4, n3 - n4 + this.v);
            graphics.drawLine(n2 - n4 + this.v, n3 + n4 + this.x, n2 - n4 + this.v, n3 + n4);
            this.v += this.u;
            graphics.drawLine(n2 - n4 - this.x, n3 - n4 + this.v, n2 - n4, n3 - n4 + this.v);
            graphics.drawLine(n2 - n4 + this.v, n3 + n4 + this.x, n2 - n4 + this.v, n3 + n4);
            this.v += this.u;
        }
        graphics.drawLine(n2 - n4 - this.w, n3 - n4 + this.v, n2 - n4, n3 - n4 + this.v);
        graphics.drawLine(n2 - n4 + this.v, n3 + n4 + this.w, n2 - n4 + this.v, n3 + n4);
        graphics.drawLine(n2 - n4 - (this.w << 1), n3, n2 - n4, n3);
        graphics.drawLine(n2, n3 + n4 + (this.w << 1), n2, n3 + n4);
        this.y = this.l == 0 ? 0 : this.l >> 13;
        this.z = this.m == 0 ? 0 : this.m >> 13;
        if (Math.abs(this.l >> 18) > 1) {
            graphics.setColor(0xFF0000);
        } else {
            graphics.setColor(65280);
        }
        graphics.fillTriangle(n2 + this.y, n3 + n4, n2 + this.y + this.x, n3 + n4 + this.w, n2 + this.y - this.x, n3 + n4 + this.w);
        if (Math.abs(this.m >> 15) > 1) {
            graphics.setColor(0xFF0000);
        } else {
            graphics.setColor(65280);
        }
        graphics.fillTriangle(n2 - n4, n3 + this.z, n2 - n4 - this.w, n3 + this.z + this.x, n2 - n4 - this.w, n3 + this.z - this.x);
    }

    public final void b(Graphics graphics) {
        com.mnemonicstudios.novusapp.j.c = 0;
        com.mnemonicstudios.novusapp.j.a = 240;
        com.mnemonicstudios.novusapp.j.b = 320;
        b = this.j >> 16;
        c = this.k >> 16;
        graphics.setClip(0, 0, 240, 320);
        com.mnemonicstudios.novusapp.n.a.a(b, c);
        com.mnemonicstudios.novusapp.n.a.e(graphics);
        com.mnemonicstudios.novusapp.n.a.f(graphics);
        com.mnemonicstudios.novusapp.n.a.b(graphics);
        this.a(this.a[0][0], this.a[0][1], 4);
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a, 512, 0);
        switch (a) {
            case 3: {
                ++this.B;
                if (this.B > 2) {
                    this.B = 0;
                }
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.f[this.A], 120, 150, this.B >> 1, 0);
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.w, 120, 160, 0, 0);
                break;
            }
            case 1: {
                ++this.B;
                if (this.B > 2) {
                    this.B = 0;
                }
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a[this.A], 115, 150, this.B >> 1, 0);
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.w, 120, 160, this.B >> 1, 0);
                this.a(graphics, 120, 160, 64);
                this.a(graphics);
                break;
            }
            case 2: {
                this.C += this.H;
                this.E += this.G;
                this.D += this.I;
                this.F += this.J;
                ++this.I;
                ++this.J;
                ++this.K;
                this.K &= 0xF;
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.b[this.A], this.E, this.F, this.K, 0);
                com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.w, this.C, this.D, 0, 0);
            }
        }
        com.mnemonicstudios.novusapp.n.a.j();
        com.mnemonicstudios.novusapp.n.a.cd = c - 160;
        com.mnemonicstudios.novusapp.n.a.d(graphics);
        com.mnemonicstudios.novusapp.n.a.g(graphics);
        com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 54, 2, 16, 20, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.c(this.f, 24, 40, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 55, 240, 16, 24, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.c(e, 240 - (com.mnemonicstudios.novusapp.n.a.a(55) >> 1), 40, com.mnemonicstudios.novusapp.n.F);
        if (this.g > 0) {
            if ((this.g & 2) > 0) {
                com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 53, 120, 46, 17, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.c(d, 120, 70, com.mnemonicstudios.novusapp.n.F);
            }
            --this.g;
        }
        if (this.d) {
            if (this.L < 16) {
                graphics.setColor(0);
                graphics.fillRect(0, 0, 240, this.L * 20);
            } else {
                graphics.setColor(0);
                graphics.fillRect(0, 0, 240, 320);
                com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 54, 120, 160, 17, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.c(this.f, 120, 184, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.a(graphics, -1, 0);
            }
        }
        this.c(graphics);
    }

    public final void c(Graphics graphics) {
        if (this.d) {
            return;
        }
        if (System.currentTimeMillis() - this.a > 1000L) {
            this.M = 128;
        }
        this.a = System.currentTimeMillis();
        if (this.M < 0) {
            return;
        }
        --this.M;
        if (this.M > 32 || (this.M & 2) != 0) {
            com.mnemonicstudios.novusapp.n.a.a(graphics, 204, 284, 0, 0, 1);
            graphics.setColor(0);
            graphics.fillRect(206, 286, 24, 24);
            graphics.setColor(255, 0, 0);
            graphics.fillRect(210, 290, 5, 16);
            graphics.fillRect(221, 290, 5, 16);
        }
    }
}

