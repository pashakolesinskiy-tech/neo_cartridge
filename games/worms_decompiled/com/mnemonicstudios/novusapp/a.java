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
public final class a
extends m {
    static int a = 32768;
    int[][] a;
    int[][] b;
    int[][][] a;
    int[][] c;
    int[] a;
    int b;
    int c;
    int d;
    int[] b;
    int e;
    int f = 10240;
    int g;
    int h;
    int i;
    int j;
    int k = 0;
    int l = 34;
    int m = 0;
    int n;
    boolean a;
    int o = 0;
    boolean b = false;
    int p = 8;
    int q = 2;
    int r = 0;
    int s = -1;
    boolean c = false;
    int t = 3;
    int u;
    int v;
    int w;
    int x;
    int y = 0;
    boolean d;
    int z;
    int A = 160;
    boolean e = false;
    int B;
    int C;
    int D;
    int[][] d = true;
    int E;
    int F = -1;
    long a = 0L;

    public a() {
        this.b = new int[10][4];
        this.a = new int[5][8][10];
        this.c = new int[8][10];
        this.a = new int[8];
        this.b = new int[]{0xFF0000, 65280, 255, 0xFFFF00, 65535};
        this.d = new int[16][4];
    }

    public final void a() {
        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.i.a, -20);
        this.b = -(this.z & 0x7F);
        switch (com.mnemonicstudios.novusapp.j.bL) {
            case 0: {
                this.c = 1;
                break;
            }
            case 1: {
                this.c = 4;
                break;
            }
            case 2: {
                this.c = 7;
                break;
            }
            case 3: {
                this.c = 10;
                break;
            }
            case 4: {
                this.c = 13;
            }
        }
        while (this.b < 240) {
            try {
                com.mnemonicstudios.novusapp.i.a.drawImage(com.mnemonicstudios.novusapp.n.a.a[this.c], this.b, 288, 20);
            }
            catch (Exception exception) {}
            try {
                com.mnemonicstudios.novusapp.i.a.drawImage(com.mnemonicstudios.novusapp.n.a.c, this.b, 280, 20);
                com.mnemonicstudios.novusapp.i.a.drawImage(com.mnemonicstudios.novusapp.n.a.c, this.b + 64, 280, 20);
            }
            catch (Exception exception) {}
            this.b += 128;
        }
    }

    public final void a(Graphics graphics) {
        graphics.setColor(65280);
        graphics.drawLine(0, 52, 240, 52);
        graphics.drawLine((this.z - 120) * this.e >> 16, 0, (this.z - 120) * this.e >> 16, 52);
        graphics.drawLine((this.z + 120) * this.e >> 16, 0, (this.z + 120) * this.e >> 16, 52);
        graphics.setColor(0xFFFF00);
        this.d = 0;
        while (this.d < 7) {
            graphics.drawLine((this.d << 7) * this.e >> 16, (312 - (this.a[this.d] << 6)) * this.f >> 16, (this.d + 1 << 7) * this.e >> 16, (312 - (this.a[this.d + 1] << 6)) * this.f >> 16);
            ++this.d;
        }
        graphics.drawLine((this.d << 7) * this.e >> 16, (312 - (this.a[this.d] << 6)) * this.f >> 16, (this.d + 1 << 7) * this.e >> 16, (312 - (this.a[0] << 6)) * this.f >> 16);
        this.d = 0;
        while (this.d < 5) {
            graphics.setColor(this.b[this.d]);
            this.g = 0;
            while (this.g < 8) {
                if (this.a[this.d][this.g][5] != 3) {
                    graphics.fillRect((this.a[this.d][this.g][0] >> 16) * this.e >> 16, (this.a[this.d][this.g][1] >> 16) * this.f >> 16, 2, 2);
                }
                ++this.g;
            }
            ++this.d;
        }
        graphics.setColor(15761472);
        this.g = 0;
        while (this.g < 8) {
            if (this.c[this.g][5] != 3) {
                graphics.fillRect((this.c[this.g][0] >> 16) * this.e >> 16, (this.c[this.g][1] >> 16) * this.f >> 16, 2, 2);
            }
            ++this.g;
        }
    }

    public final void b() {
        this.g = 0;
        while (this.g < 8) {
            this.c[this.g][0] = com.mnemonicstudios.novusapp.n.a(1024) << 16;
            this.c[this.g][1] = 0x1200000;
            this.c[this.g][2] = 65536;
            this.c[this.g][3] = -131072;
            this.c[this.g][4] = 0;
            this.c[this.g][5] = 0;
            this.c[this.g][6] = 0;
            this.c[this.g][7] = 0;
            this.c[this.g][8] = 0;
            if (com.mnemonicstudios.novusapp.n.a(100) > 50) {
                this.c[this.g][2] = -65536;
                this.c[this.g][6] = 1;
            }
            ++this.g;
        }
    }

    public final void a(int n2, int n3) {
        this.g = 0;
        while (this.g < n3) {
            switch (n2) {
                case 0: {
                    this.a[n2][this.g][0] = com.mnemonicstudios.novusapp.n.a(1024) << 16;
                    this.a[n2][this.g][1] = -64 - com.mnemonicstudios.novusapp.n.a(128) << 16;
                    this.a[n2][this.g][2] = 0;
                    this.a[n2][this.g][3] = -131072;
                    this.a[n2][this.g][4] = 0;
                    this.a[n2][this.g][5] = 0;
                    this.a[n2][this.g][6] = 0;
                    this.a[n2][this.g][7] = 0;
                    this.a[n2][this.g][8] = 0;
                    this.a[n2][this.g][9] = 0;
                }
            }
            ++this.g;
        }
    }

    public final void a(boolean bl) {
        this.a = bl;
        this.e = false;
        this.k = 0;
        this.l = 30;
        this.m = 0;
        this.h = 512;
        this.z = 512;
        this.i = 0xA00000;
        this.t = 3;
        this.d = true;
        this.c();
        com.mnemonicstudios.novusapp.n.a.a();
    }

    public final void c() {
        if (!com.mnemonicstudios.novusapp.j.m) {
            com.mnemonicstudios.novusapp.n.a.l();
        }
        this.d = 0;
        while (this.d < 5) {
            this.g = 0;
            while (this.g < 8) {
                this.a[this.d][this.g][5] = 3;
                ++this.g;
            }
            ++this.d;
        }
        this.g = 0;
        while (this.g < 8) {
            this.c[this.g][5] = 3;
            this.a[this.g] = 0;
            if (this.g > 0 && this.a[this.g - 1] > 0 && this.a[this.g] > 0) {
                this.a[this.g] = 0;
            }
            ++this.g;
        }
        this.b();
        this.a(0, 8);
        ++this.k;
        if (this.a && this.k > 3) {
            this.e = true;
            this.B = 0;
        }
        if (this.l > 2) {
            this.l -= 2;
        }
        this.j();
        this.d();
    }

    public final void d() {
        this.n = 0;
        while (this.n < 10) {
            this.a[this.n][0] = 0;
            this.a[this.n][1] = 0;
            this.a[this.n][2] = 0;
            this.b[this.n][0] = 0;
            this.b[this.n][1] = 0;
            this.b[this.n][2] = 0;
            ++this.n;
        }
    }

    public final boolean a(int n2, int n3, int n4, int n5, int n6, int n7) {
        return Math.abs(n4 - n2) < n6 && n3 < n5 && n3 > n5 - n7;
    }

    public final void e() {
        if ((com.mnemonicstudios.novusapp.n.b() || com.mnemonicstudios.novusapp.n.h) && !this.e) {
            com.mnemonicstudios.novusapp.n.a.a(false);
        }
        if (this.e) {
            if (com.mnemonicstudios.novusapp.n.c()) {
                com.mnemonicstudios.novusapp.n.a.c(this.a);
            }
            ++this.B;
            return;
        }
        this.j = this.j + 1 & 3;
        if (this.c) {
            this.w += this.u;
            this.x += this.v;
            this.v += 2;
            ++this.y;
            if (this.y > 15) {
                this.y = 0;
            }
            if (this.x > 480) {
                this.h = 512;
                this.z = 512;
                this.i = 0xA00000;
                --this.t;
                if (this.t == 0) {
                    this.B = 0;
                    this.e = true;
                }
                this.c();
                this.c = false;
            }
        }
        this.b = true;
        this.g = 0;
        while (this.g < 8) {
            if (this.a[0][this.g][5] != 3) {
                this.b = false;
            }
            ++this.g;
        }
        if (this.b) {
            ++this.o;
            this.c();
        }
        this.n = 0;
        while (this.n < 10) {
            if (this.b[this.n][0] != 0) {
                this.g = 0;
                while (this.g < 8) {
                    if (this.a[0][this.g][5] != 3 && this.a(this.b[this.n][1], this.b[this.n][2], this.a[0][this.g][0] >> 16, (this.a[0][this.g][1] >> 16) + 12, 16, 24)) {
                        switch (this.a[0][this.g][5]) {
                            case 1: {
                                this.m += 125;
                                break;
                            }
                            case 0: {
                                this.m += 200;
                                break;
                            }
                            case 2: {
                                this.m += 55;
                            }
                        }
                        switch (this.a[0][this.g][5]) {
                            case 1: {
                                this.c[this.g][5] = 2;
                            }
                            case 0: 
                            case 2: {
                                this.a[0][this.g][5] = 3;
                                this.b(this.a[0][this.g][0] >> 16, this.a[0][this.g][1] >> 16);
                            }
                        }
                    }
                    ++this.g;
                }
            }
            ++this.n;
        }
        com.mnemonicstudios.novusapp.n.a.a(512);
        if (!this.c) {
            if (com.mnemonicstudios.novusapp.n.i) {
                this.z -= 8;
                if (this.z < -120) {
                    this.z = 1143;
                }
                this.p = -12;
            }
            if (com.mnemonicstudios.novusapp.n.j) {
                this.z += 8;
                if (this.z > 1143) {
                    this.z = -120;
                }
                this.p = 12;
            }
            if (com.mnemonicstudios.novusapp.n.k) {
                this.i -= 262144;
                if (this.i < 0x200000) {
                    this.i = 0x200000;
                }
            }
            if (com.mnemonicstudios.novusapp.n.l) {
                this.i += 262144;
                if (this.i > 0x1400000) {
                    this.i = 0x1400000;
                }
            }
            if (com.mnemonicstudios.novusapp.n.m && this.s < 0) {
                this.a(this.h >> 16, this.i >> 16, this.p);
                this.s = 16;
            }
        }
        if (this.s >= 0) {
            --this.s;
        }
        this.h = this.z << 16;
        this.n = 0;
        while (this.n < 10) {
            if (this.b[this.n][0] != 0) {
                int[] nArray = this.b[this.n];
                nArray[1] = nArray[1] + this.b[this.n][0];
                if (this.b[this.n][1] < (this.h >> 16) - 240) {
                    this.b[this.n][0] = 0;
                }
                if (this.b[this.n][1] > (this.h >> 16) + 240) {
                    this.b[this.n][0] = 0;
                }
            }
            if (this.a[this.n][0] != 0) {
                int[] nArray = this.a[this.n];
                nArray[1] = nArray[1] + this.a[this.n][0];
                if (this.a[this.n][1] > (this.h >> 16) + 240) {
                    this.a[this.n][0] = 0;
                }
            }
            ++this.n;
        }
        this.f();
        this.g();
    }

    public final void b(Graphics graphics) {
        com.mnemonicstudios.novusapp.j.c = 0;
        com.mnemonicstudios.novusapp.j.a = 240;
        com.mnemonicstudios.novusapp.j.b = 320;
        graphics.setClip(0, 0, 240, 320);
        com.mnemonicstudios.novusapp.n.a.a(this.z, this.A);
        this.a();
        this.i();
        this.h();
        this.c(graphics);
        com.mnemonicstudios.novusapp.n.a.a(graphics, com.mnemonicstudios.novusapp.n.a, 512, 0);
        this.n = 0;
        while (this.n < 10) {
            if (this.a[this.n][0] != 0) {
                if (this.a[this.n][0] > 0) {
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.m, this.a[this.n][1], this.a[this.n][2] - 8 + (com.mnemonicstudios.novusapp.n.a(4) - 2), 0, 0);
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.l, this.a[this.n][1], this.a[this.n][2], 0, 0);
                } else {
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.m, this.a[this.n][1], this.a[this.n][2] - 8 + (com.mnemonicstudios.novusapp.n.a(4) - 2), 15, 0);
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.l, this.a[this.n][1], this.a[this.n][2], 15, 0);
                }
                com.mnemonicstudios.novusapp.j.f(this.a[this.n][1], this.a[this.n][2]);
            }
            if (this.b[this.n][0] != 0) {
                if (this.b[this.n][0] > 0) {
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.m, this.b[this.n][1] - 8 - (com.mnemonicstudios.novusapp.n.a(4) - 2), this.b[this.n][2] - 1, 4, 0);
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.l, this.b[this.n][1], this.b[this.n][2], 4, 0);
                } else {
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.m, this.b[this.n][1] + 8 - (com.mnemonicstudios.novusapp.n.a(4) - 2), this.b[this.n][2] - 1, 12, 0);
                    com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.l, this.b[this.n][1], this.b[this.n][2], 12, 0);
                }
                com.mnemonicstudios.novusapp.j.f(this.b[this.n][1], this.b[this.n][2]);
            }
            ++this.n;
        }
        if (!this.c) {
            if (this.p > 0) {
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a[this.r], (this.h >> 16) - 5, (this.i >> 16) - 10, this.j >> 1, 0);
            } else {
                com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a[this.r], (this.h >> 16) + 4, (this.i >> 16) - 10, this.j >> 1, 1);
            }
        }
        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.w, this.h >> 16, this.i >> 16, this.j >> 1, 0);
        if (this.c) {
            com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.b[this.r], this.w, this.x, this.y, 0);
        }
        this.a(graphics);
        com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 54, 2, 64, 20, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.c(this.m, 24, 90, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 55, 240, 64, 24, com.mnemonicstudios.novusapp.n.F);
        com.mnemonicstudios.novusapp.n.a.c(this.t, 240 - (com.mnemonicstudios.novusapp.n.a.a(55) >> 1), 90, com.mnemonicstudios.novusapp.n.F);
        if (this.e) {
            if (this.B < 16) {
                graphics.setColor(0);
                graphics.fillRect(0, 0, 240, this.B * 20);
            } else {
                graphics.setColor(0);
                graphics.fillRect(0, 0, 240, 320);
                com.mnemonicstudios.novusapp.n.a.b(com.mnemonicstudios.novusapp.i.a, 54, 120, 160, 17, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.c(this.m, 120, 184, com.mnemonicstudios.novusapp.n.F);
                com.mnemonicstudios.novusapp.n.a.a(graphics, -1, 0);
            }
        }
        this.d(graphics);
    }

    public final void f() {
        this.g = 0;
        while (this.g < 8) {
            if (this.c[this.g][5] != 3) {
                switch (this.c[this.g][5]) {
                    case 0: {
                        int[] nArray = this.c[this.g];
                        nArray[0] = nArray[0] + this.c[this.g][2];
                        if (this.c[this.g][0] >> 16 < 0) {
                            this.c[this.g][0] = 0;
                            this.c[this.g][6] = 0;
                            this.c[this.g][2] = 65536;
                        }
                        if (this.c[this.g][0] >> 16 <= 1024) break;
                        this.c[this.g][0] = 0x4000000;
                        this.c[this.g][6] = 1;
                        this.c[this.g][2] = -65536;
                        break;
                    }
                    case 1: {
                        break;
                    }
                    case 2: {
                        int[] nArray = this.c[this.g];
                        nArray[3] = nArray[3] + a;
                        int[] nArray2 = this.c[this.g];
                        nArray2[1] = nArray2[1] + this.c[this.g][3];
                        if (this.c[this.g][1] <= 0x1200000) break;
                        this.c[this.g][1] = 0x1200000;
                        this.c[this.g][3] = 0;
                        this.c[this.g][5] = 0;
                    }
                }
            }
            ++this.g;
        }
    }

    public final void g() {
        this.g = 0;
        while (this.g < 8) {
            if (this.a[0][this.g][5] != 3) {
                switch (this.a[0][this.g][5]) {
                    case 0: {
                        int[] nArray = this.a[0][this.g];
                        nArray[0] = nArray[0] + this.a[0][this.g][2];
                        int[] nArray2 = this.a[0][this.g];
                        nArray2[1] = nArray2[1] + this.a[0][this.g][3];
                        if (this.a[0][this.g][0] > this.c[this.g][0]) {
                            int[] nArray3 = this.a[0][this.g];
                            nArray3[2] = nArray3[2] - 32768;
                            if (this.a[0][this.g][2] >> 16 < -8) {
                                this.a[0][this.g][2] = -524288;
                            }
                        }
                        if (this.a[0][this.g][0] < this.c[this.g][0]) {
                            int[] nArray4 = this.a[0][this.g];
                            nArray4[2] = nArray4[2] + 32768;
                            if (this.a[0][this.g][2] >> 16 > 8) {
                                this.a[0][this.g][2] = 524288;
                            }
                        }
                        if (this.a[0][this.g][1] < this.c[this.g][1]) {
                            int[] nArray5 = this.a[0][this.g];
                            nArray5[3] = nArray5[3] + 32768;
                            if (this.a[0][this.g][3] >> 16 > 1) {
                                this.a[0][this.g][3] = 65536;
                            }
                        }
                        if (this.a[0][this.g][1] > this.c[this.g][1]) {
                            int[] nArray6 = this.a[0][this.g];
                            nArray6[3] = nArray6[3] - 32768;
                            if (this.a[0][this.g][3] >> 16 < -1) {
                                this.a[0][this.g][3] = -65536;
                            }
                        }
                        this.C = this.a[0][this.g][1] - this.c[this.g][1] >> 16;
                        this.D = this.a[0][this.g][0] - this.c[this.g][0] >> 16;
                        if (this.C * this.C + this.D * this.D >= 16) break;
                        this.a[0][this.g][5] = 1;
                        this.c[this.g][5] = 1;
                        break;
                    }
                    case 1: {
                        int[] nArray = this.a[0][this.g];
                        nArray[1] = nArray[1] + Short.MIN_VALUE;
                        int[] nArray7 = this.c[this.g];
                        nArray7[1] = nArray7[1] + Short.MIN_VALUE;
                        if (this.a[0][this.g][1] >> 16 >= 32) break;
                        this.b(this.a[0][this.g][0] >> 16, this.a[0][this.g][1] >> 16);
                        this.c[this.g][5] = 3;
                        this.a[0][this.g][5] = 2;
                        break;
                    }
                    case 2: {
                        int[] nArray = this.a[0][this.g];
                        nArray[1] = nArray[1] + Short.MIN_VALUE;
                        int[] nArray8 = this.a[0][this.g];
                        nArray8[0] = nArray8[0] + this.a[0][this.g][2];
                        int[] nArray9 = this.a[0][this.g];
                        nArray9[1] = nArray9[1] + this.a[0][this.g][3];
                        if (this.a[0][this.g][0] > this.h) {
                            int[] nArray10 = this.a[0][this.g];
                            nArray10[2] = nArray10[2] - 32768;
                            if (this.a[0][this.g][2] >> 16 < -8) {
                                this.a[0][this.g][2] = -524288;
                            }
                        }
                        if (this.a[0][this.g][0] < this.h) {
                            int[] nArray11 = this.a[0][this.g];
                            nArray11[2] = nArray11[2] + 32768;
                            if (this.a[0][this.g][2] >> 16 > 8) {
                                this.a[0][this.g][2] = 524288;
                            }
                        }
                        if (this.a[0][this.g][1] < this.i) {
                            int[] nArray12 = this.a[0][this.g];
                            nArray12[3] = nArray12[3] + 32768;
                            if (this.a[0][this.g][3] >> 16 > 1) {
                                this.a[0][this.g][3] = 65536;
                            }
                        }
                        if (this.a[0][this.g][1] > this.i) {
                            int[] nArray13 = this.a[0][this.g];
                            nArray13[3] = nArray13[3] - 32768;
                            if (this.a[0][this.g][3] >> 16 < -1) {
                                this.a[0][this.g][3] = -65536;
                            }
                        }
                        if (this.c) break;
                        this.C = this.a[0][this.g][1] - this.i >> 16;
                        this.D = this.a[0][this.g][0] - this.h >> 16;
                        if (this.C * this.C + this.D * this.D >= 16) break;
                        this.c = true;
                        this.w = this.h >> 16;
                        this.x = this.i >> 16;
                        this.u = com.mnemonicstudios.novusapp.n.a(8) - 4;
                        this.v = -16;
                        this.y = 0;
                        this.b(this.w, this.x);
                    }
                }
            }
            ++this.g;
        }
    }

    public final void h() {
        this.g = 0;
        while (this.g < 8) {
            if (this.a[0][this.g][5] != 3) {
                switch (this.a[0][this.g][5]) {
                    case 0: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.w, this.a[0][this.g][0] >> 16, this.a[0][this.g][1] >> 16, this.a[0][this.g][4], this.a[0][this.g][6]);
                        int[] nArray = this.a[0][this.g];
                        nArray[4] = nArray[4] + 1;
                        if (this.a[0][this.g][4] <= 2) break;
                        this.a[0][this.g][4] = 0;
                        break;
                    }
                    case 1: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a[this.r], (this.a[0][this.g][0] >> 16) - 5, (this.a[0][this.g][1] >> 16) - 10, 0, this.a[0][this.g][6]);
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.w, this.a[0][this.g][0] >> 16, this.a[0][this.g][1] >> 16, this.a[0][this.g][4], this.a[0][this.g][6]);
                        int[] nArray = this.a[0][this.g];
                        nArray[4] = nArray[4] + 1;
                        if (this.a[0][this.g][4] <= 2) break;
                        this.a[0][this.g][4] = 0;
                        break;
                    }
                    case 2: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a[this.q], (this.a[0][this.g][0] >> 16) - 5, (this.a[0][this.g][1] >> 16) - 10, 0, this.a[0][this.g][6]);
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.w, this.a[0][this.g][0] >> 16, this.a[0][this.g][1] >> 16, this.a[0][this.g][4], this.a[0][this.g][6]);
                        int[] nArray = this.a[0][this.g];
                        nArray[4] = nArray[4] + 1;
                        if (this.a[0][this.g][4] <= 2) break;
                        this.a[0][this.g][4] = 0;
                    }
                }
            }
            ++this.g;
        }
    }

    public final void i() {
        this.g = 0;
        while (this.g < 8) {
            if (this.c[this.g][5] != 3) {
                switch (this.c[this.g][5]) {
                    case 0: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.a[this.r], this.c[this.g][0] >> 16, this.c[this.g][1] >> 16, this.c[this.g][4], this.c[this.g][6]);
                        int[] nArray = this.c[this.g];
                        nArray[4] = nArray[4] + 1;
                        if (this.c[this.g][4] <= 2) break;
                        this.c[this.g][4] = 0;
                        break;
                    }
                    case 1: {
                        break;
                    }
                    case 2: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.c[this.r], this.c[this.g][0] >> 16, this.c[this.g][1] >> 16, 0, this.c[this.g][6]);
                    }
                }
            }
            ++this.g;
        }
    }

    public final void a(int n2, int n3, int n4) {
        this.n = 0;
        while (this.n < 10) {
            if (this.b[this.n][0] == 0) {
                this.b[this.n][0] = 0;
                this.b[this.n][0] = n4;
                this.b[this.n][1] = n2;
                this.b[this.n][2] = n3;
                return;
            }
            ++this.n;
        }
    }

    public final void j() {
        this.E = 0;
        while (this.E < this.d.length) {
            this.d[this.E][2] = -1;
            ++this.E;
        }
    }

    public final void b(int n2, int n3) {
        this.E = 0;
        while (this.E < this.d.length) {
            if (this.d[this.E][2] < 0) {
                this.d[this.E][0] = n2;
                this.d[this.E][1] = n3;
                this.d[this.E][2] = 0;
                return;
            }
            ++this.E;
        }
    }

    public final void c(Graphics graphics) {
        try {
            this.E = 0;
            while (this.E < this.d.length) {
                if (this.d[this.E][2] >= 0) {
                    if (this.d[this.E][2] == 1) {
                        com.mnemonicstudios.novusapp.j.h(this.d[this.E][0], this.d[this.E][1], 32);
                    }
                    if (this.d[this.E][2] < 3) {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.k, this.d[this.E][0], this.d[this.E][1] + 32, this.d[this.E][2], 0);
                    } else {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.k, this.d[this.E][0], this.d[this.E][1] + 32, 5 - this.d[this.E][2], 0);
                    }
                    int[] nArray = this.d[this.E];
                    nArray[2] = nArray[2] + 1;
                    if (this.d[this.E][2] > 5) {
                        this.d[this.E][2] = -1;
                    }
                }
                ++this.E;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }

    public final void d(Graphics graphics) {
        if (this.e) {
            return;
        }
        if (System.currentTimeMillis() - this.a > 1000L) {
            this.F = 128;
        }
        this.a = System.currentTimeMillis();
        if (this.F < 0) {
            return;
        }
        --this.F;
        if (this.F > 32 || (this.F & 2) != 0) {
            com.mnemonicstudios.novusapp.n.a.a(graphics, 204, 284, 0, 0, 1);
            graphics.setColor(0);
            graphics.fillRect(206, 286, 24, 24);
            graphics.setColor(255, 0, 0);
            graphics.fillRect(210, 290, 5, 16);
            graphics.fillRect(221, 290, 5, 16);
        }
    }
}

