/*
 * Decompiled with CFR 0.152.
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.n;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class e {
    int[][] a;
    int[][] b;
    int a;
    int b;
    int c;
    int d;
    int e;
    int f;
    boolean a = new int[32][13];
    int g;
    int h;
    int i;
    int j;
    int k;
    int l;
    int m;
    int n;
    int o;
    int p;
    int q = 0;
    int r;
    int s;
    int t;
    int u;
    int v;
    int w;
    int x;
    int y = 131072;

    public final void a(int n2, int n3) {
        this.a = 0;
        while (this.a < n3) {
            this.e(n2);
            ++this.a;
        }
    }

    public final int a(int n2) {
        return this.b[n2][2];
    }

    public final int b(int n2) {
        return this.b[n2][0];
    }

    public final int c(int n2) {
        this.c = 0;
        this.b = 0;
        while (this.b < this.a.length) {
            if (this.a[this.b][7] == n2 && this.a[this.b][2] == 1) {
                ++this.c;
            }
            ++this.b;
        }
        return this.c;
    }

    public e() {
        this.b = new int[16][4];
    }

    public final void b(int n2, int n3) {
        int[] nArray = this.a[n2];
        nArray[8] = nArray[8] + n3;
        if (this.a[n2][8] > 100) {
            this.a[n2][8] = 100;
        }
    }

    public final int d(int n2) {
        return this.a[n2][8];
    }

    public final void a() {
        this.d = 0;
        while (this.d < this.a.length) {
            this.a[this.d][2] = 0;
            ++this.d;
        }
        this.d = 0;
        while (this.d < 11) {
            this.b[this.d][0] = 0;
            this.b[this.d][1] = 0;
            this.b[this.d][2] = 0;
            this.b[this.d][3] = 0;
            ++this.d;
        }
    }

    public final boolean a(int n2, int n3, int n4) {
        this.l = 1023 * 1023 + 511 * 511;
        try {
            this.j = 0;
            while (this.j < com.mnemonicstudios.novusapp.n.a.aJ) {
                this.k = 0;
                while (this.k < com.mnemonicstudios.novusapp.n.a.aK) {
                    if (com.mnemonicstudios.novusapp.n.a.a[this.j][this.k][4] >= 0) {
                        this.n = n2 - com.mnemonicstudios.novusapp.n.a.a[this.j][this.k][0];
                        this.o = n3 - com.mnemonicstudios.novusapp.n.a.a[this.j][this.k][1];
                        this.m = this.n * this.n + this.o * this.o;
                        if (this.m < this.l) {
                            this.l = this.m;
                        }
                        if (this.l < n4) {
                            this.e = this.k + (this.j << 8);
                            return true;
                        }
                    }
                    ++this.k;
                }
                ++this.j;
            }
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        return false;
    }

    public final boolean a(int n2, int n3, int n4, int n5) {
        this.l = 1023 * 1023 + 511 * 511;
        try {
            this.j = n5;
            this.k = 0;
            while (this.k < com.mnemonicstudios.novusapp.n.a.aK) {
                if (com.mnemonicstudios.novusapp.n.a.a[this.j][this.k][4] >= 0) {
                    this.n = n2 - com.mnemonicstudios.novusapp.n.a.a[this.j][this.k][0];
                    this.o = n3 - com.mnemonicstudios.novusapp.n.a.a[this.j][this.k][1];
                    this.m = this.n * this.n + this.o * this.o;
                    if (this.m < this.l) {
                        this.l = this.m;
                    }
                    if (this.l < n4) {
                        this.e = this.k + (this.j << 8);
                        return true;
                    }
                }
                ++this.k;
            }
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        return false;
    }

    public final boolean b(int n2, int n3, int n4, int n5) {
        this.l = 1023 * 1023 + 511 * 511;
        try {
            this.d = 0;
            while (this.d < this.a.length) {
                if (this.a[this.d][2] != 0 && n2 == this.a[this.d][7]) {
                    this.n = n3 - (this.a[this.d][0] >> 16);
                    this.o = n4 - (this.a[this.d][1] >> 16);
                    this.m = this.n * this.n + this.o * this.o;
                    if (this.m < this.l) {
                        this.l = this.m;
                    }
                    if (this.l < n5) {
                        return true;
                    }
                }
                ++this.d;
            }
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        return false;
    }

    public final int a(int n2, int n3) {
        this.l = 1023 * 1023 + 511 * 511;
        this.f = 0;
        try {
            this.j = 0;
            while (this.j < com.mnemonicstudios.novusapp.n.a.aJ) {
                if (!com.mnemonicstudios.novusapp.n.a.a[this.j]) {
                    this.k = 0;
                    while (this.k < com.mnemonicstudios.novusapp.n.a.aK) {
                        if (com.mnemonicstudios.novusapp.n.a.a[this.j][this.k][4] >= 0) {
                            this.n = (this.a[n2][0] >> 16) - com.mnemonicstudios.novusapp.n.a.a[this.j][this.k][0];
                            this.o = (this.a[n2][1] >> 16) - com.mnemonicstudios.novusapp.n.a.a[this.j][this.k][1];
                            this.m = this.n * this.n + this.o * this.o;
                            if (this.m <= n3) {
                                ++this.f;
                            }
                        }
                        ++this.k;
                    }
                }
                ++this.j;
            }
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
        }
        return this.f;
    }

    public final int a(int n2, int n3, int n4) {
        return this.b(n2, n4);
    }

    public final int e(int n2) {
        return this.b(n2, 100);
    }

    public final int b(int n2, int n3) {
        this.a = false;
        while (!this.a) {
            this.g = com.mnemonicstudios.novusapp.n.a(1023);
            if (com.mnemonicstudios.novusapp.j.a[this.g] <= 0) continue;
            this.i = com.mnemonicstudios.novusapp.j.a[this.g];
            while (!com.mnemonicstudios.novusapp.n.a.a(this.g, this.i) && this.i < 400) {
                ++this.i;
            }
            --this.i;
            if (this.i <= 0 || this.i >= 400) continue;
            if (n2 == 7 || n2 == 9) {
                if (this.a(this.g, this.i, 768) || this.b(n2, this.g, this.i, 1024)) continue;
                this.h = this.i;
                this.a = true;
                continue;
            }
            if (this.a(this.g, this.i, 768)) continue;
            this.h = this.i;
            this.a = true;
        }
        return this.a(n2, this.g, this.h, n3);
    }

    public final boolean a(int n2) {
        this.a = false;
        while (!this.a) {
            this.g = com.mnemonicstudios.novusapp.n.a(1023);
            this.i = 0;
            while (!com.mnemonicstudios.novusapp.n.a.a(this.g, this.i) && this.i < 500) {
                ++this.i;
            }
            if (this.i >= 480) continue;
            this.h = this.i = -256;
            this.a = true;
        }
        return this.b(n2, this.g, this.h);
    }

    public final int b(int n2, int n3, int n4) {
        return this.a(n2, n3, n4, 100);
    }

    public final int a(int n2, int n3, int n4, int n5) {
        this.d = 0;
        while (this.d < this.a.length) {
            if (this.a[this.d][2] == 0) {
                this.a[this.d][0] = n3 << 16;
                this.a[this.d][1] = n4 << 16;
                this.a[this.d][2] = 1;
                this.a[this.d][3] = com.mnemonicstudios.novusapp.n.a(5);
                this.a[this.d][4] = 0;
                this.a[this.d][5] = 0;
                this.a[this.d][12] = 100;
                this.a[this.d][6] = 50 - com.mnemonicstudios.novusapp.n.a(100);
                this.a[this.d][7] = n2;
                this.a[this.d][8] = n5;
                this.a[this.d][9] = com.mnemonicstudios.novusapp.n.a(9) + 2;
                this.b[n2][0] = this.c(n2);
                return this.d;
            }
            ++this.d;
        }
        return -1;
    }

    public final int a() {
        return this.a[this.p][0] >> 16;
    }

    public final int b() {
        return this.a[this.p][1] >> 16;
    }

    public final boolean b(int n2, int n3, int n4) {
        this.d = 0;
        while (this.d < this.a.length) {
            if (this.a[this.d][2] == 0) {
                this.a[this.d][0] = n3 << 16;
                this.a[this.d][1] = n4 << 16;
                this.a[this.d][2] = 3;
                this.a[this.d][3] = com.mnemonicstudios.novusapp.n.a(5);
                this.a[this.d][4] = 0;
                this.a[this.d][5] = 0;
                this.a[this.d][6] = 50 - com.mnemonicstudios.novusapp.n.a(100);
                this.a[this.d][7] = n2;
                this.a[this.d][9] = com.mnemonicstudios.novusapp.n.a(9) + 2;
                this.p = this.d;
                return true;
            }
            ++this.d;
        }
        return false;
    }

    public final void a(int n2, int n3, int n4) {
        this.r = n4 * n4;
        this.t = (n4 + (n4 >> 1)) * (n4 + (n4 >> 1));
        this.q = 0;
        while (this.q < this.a.length) {
            if (this.a[this.q][2] != 0) {
                try {
                    this.s = ((this.a[this.q][0] >> 16) - n2) * ((this.a[this.q][0] >> 16) - n2) + ((this.a[this.q][1] >> 16) - n3) * ((this.a[this.q][1] >> 16) - n3);
                    if (this.s <= this.r) {
                        this.a[this.q][4] = this.a[this.q][0] >> 16 < n2 ? -2 - com.mnemonicstudios.novusapp.n.a(2) << 16 : 2 + com.mnemonicstudios.novusapp.n.a(2) << 16;
                        this.a[this.q][5] = -12 - com.mnemonicstudios.novusapp.n.a(4) << 16;
                        switch (this.a[this.q][7]) {
                            case 7: {
                                this.a[this.q][2] = 0;
                                this.c(this.a[this.q][0] >> 16, this.a[this.q][1] >> 16);
                                int[] nArray = this.b[7];
                                nArray[1] = nArray[1] + 1;
                                this.b[7][0] = this.c(7);
                                break;
                            }
                            case 4: {
                                this.a[this.q][2] = 0;
                                this.c(this.a[this.q][0] >> 16, this.a[this.q][1] >> 16);
                                int[] nArray = this.b[4];
                                nArray[1] = nArray[1] + 1;
                                this.b[4][0] = this.c(4);
                                break;
                            }
                            case 1: {
                                this.a[this.q][2] = 0;
                                this.c(this.a[this.q][0] >> 16, this.a[this.q][1] >> 16);
                                int[] nArray = this.b[1];
                                nArray[1] = nArray[1] + 1;
                                this.b[1][0] = this.c(1);
                                break;
                            }
                            case 5: {
                                int[] nArray = this.a[this.q];
                                nArray[8] = nArray[8] - (20 + com.mnemonicstudios.novusapp.n.a(20));
                                if (this.a[this.q][8] > 0) break;
                                this.a[this.q][8] = 0;
                                this.a[this.q][2] = 0;
                                this.c(this.a[this.q][0] >> 16, this.a[this.q][1] >> 16);
                                int[] nArray2 = this.b[5];
                                nArray2[1] = nArray2[1] + 1;
                                this.b[5][0] = this.c(5);
                                break;
                            }
                            case 8: {
                                int[] nArray = this.a[this.q];
                                nArray[8] = nArray[8] - (20 + com.mnemonicstudios.novusapp.n.a(20));
                                if (this.a[this.q][8] > 0) break;
                                this.a[this.q][8] = 0;
                                this.a[this.q][2] = 0;
                                this.c(this.a[this.q][0] >> 16, this.a[this.q][1] >> 16);
                                int[] nArray3 = this.b[8];
                                nArray3[1] = nArray3[1] + 1;
                                this.b[8][0] = this.c(8);
                                break;
                            }
                            case 9: {
                                if (com.mnemonicstudios.novusapp.n.a.b != 6) break;
                                this.a[this.q][8] = 0;
                                this.a[this.q][2] = 0;
                                this.c(this.a[this.q][0] >> 16, this.a[this.q][1] >> 16);
                                int[] nArray = this.b[9];
                                nArray[1] = nArray[1] + 1;
                                this.b[9][0] = this.c(9);
                            }
                        }
                    } else if (this.s <= this.t) {
                        this.a[this.q][4] = this.a[this.q][0] >> 16 < n2 ? -1 - com.mnemonicstudios.novusapp.n.a(1) << 16 : 1 + com.mnemonicstudios.novusapp.n.a(1) << 16;
                        this.a[this.q][5] = -8 - com.mnemonicstudios.novusapp.n.a(4) << 16;
                        switch (this.a[this.q][7]) {
                            case 7: {
                                this.a[this.q][2] = 0;
                                this.c(this.a[this.q][0] >> 16, this.a[this.q][1] >> 16);
                                int[] nArray = this.b[7];
                                nArray[1] = nArray[1] + 1;
                                this.b[7][0] = this.c(7);
                                break;
                            }
                            case 4: {
                                this.a[this.q][2] = 0;
                                this.c(this.a[this.q][0] >> 16, this.a[this.q][1] >> 16);
                                int[] nArray = this.b[4];
                                nArray[1] = nArray[1] + 1;
                                this.b[4][0] = this.c(4);
                                break;
                            }
                            case 1: {
                                this.a[this.q][2] = 0;
                                this.c(this.a[this.q][0] >> 16, this.a[this.q][1] >> 16);
                                int[] nArray = this.b[1];
                                nArray[1] = nArray[1] + 1;
                                this.b[1][0] = this.c(1);
                                break;
                            }
                            case 5: {
                                int[] nArray = this.a[this.q];
                                nArray[8] = nArray[8] - (10 + com.mnemonicstudios.novusapp.n.a(10));
                                if (this.a[this.q][8] > 0) break;
                                this.a[this.q][8] = 0;
                                this.a[this.q][2] = 0;
                                this.c(this.a[this.q][0] >> 16, this.a[this.q][1] >> 16);
                                int[] nArray4 = this.b[5];
                                nArray4[1] = nArray4[1] + 1;
                                this.b[5][0] = this.c(5);
                            }
                        }
                    }
                }
                catch (Exception exception) {}
            }
            ++this.q;
        }
        com.mnemonicstudios.novusapp.n.a.g();
    }

    /*
     * Enabled aggressive block sorting
     */
    public final void b() {
        this.d = 0;
        while (this.d < this.a.length) {
            if (this.a[this.d][2] != 0) {
                this.w = this.a[this.d][0];
                this.x = this.a[this.d][1];
                if (this.a[this.d][2] == 3) {
                    this.a[this.d][5] = 196608;
                } else {
                    int[] nArray = this.a[this.d];
                    nArray[5] = nArray[5] + this.y;
                }
                this.u = this.a[this.d][0] + this.a[this.d][4];
                this.v = this.a[this.d][1] + this.a[this.d][5];
                if (com.mnemonicstudios.novusapp.n.a.a(this.w >> 16, this.x >> 16, this.u >> 16, this.v >> 16)) {
                    this.a[this.d][4] = 0;
                    this.a[this.d][5] = 0;
                    if (this.a[this.d][2] == 3) {
                        com.mnemonicstudios.novusapp.n.a.p();
                        this.a[this.d][2] = 1;
                        this.a[this.d][3] = 0;
                    }
                    this.a[this.d][0] = com.mnemonicstudios.novusapp.n.a.ak << 16;
                    this.a[this.d][1] = com.mnemonicstudios.novusapp.n.a.al << 16;
                } else {
                    this.a[this.d][0] = this.u;
                    this.a[this.d][1] = this.v;
                }
                if (this.a[this.d][1] >> 16 > com.mnemonicstudios.novusapp.j.cf) {
                    com.mnemonicstudios.novusapp.n.a.p();
                    if (this.a[this.d][2] != 0) {
                        this.a[this.d][2] = 0;
                        this.a[this.d][8] = 0;
                        int[] nArray = this.b[this.a[this.d][7]];
                        nArray[1] = nArray[1] + 1;
                        this.b[this.a[this.d][7]][0] = this.c(this.a[this.d][7]);
                    }
                }
                switch (this.a[this.d][2]) {
                    case 3: {
                        if (this.a[this.d][6] > 0) {
                            int[] nArray = this.a[this.d];
                            nArray[3] = nArray[3] + 1;
                            if (this.a[this.d][3] <= 12) break;
                            this.a[this.d][3] = 12;
                            this.a[this.d][6] = -1;
                            break;
                        }
                        int[] nArray = this.a[this.d];
                        nArray[3] = nArray[3] - 1;
                        if (this.a[this.d][3] >= 0) break;
                        this.a[this.d][3] = 0;
                        this.a[this.d][6] = 1;
                        break;
                    }
                    case 1: {
                        if (this.a[this.d][6] > 0) {
                            int[] nArray = this.a[this.d];
                            nArray[3] = nArray[3] + 1;
                            if (this.a[this.d][3] > 5) {
                                this.a[this.d][3] = 5;
                                this.a[this.d][6] = -1;
                            }
                        } else {
                            int[] nArray = this.a[this.d];
                            nArray[3] = nArray[3] - 1;
                            if (this.a[this.d][3] < 0) {
                                this.a[this.d][3] = 0;
                                this.a[this.d][6] = 1;
                            }
                        }
                        switch (this.a[this.d][7]) {
                            case 10: {
                                this.a[this.d][2] = 2;
                                this.a[this.d][3] = 0;
                                break;
                            }
                            case 6: {
                                this.a[this.d][3] = 0;
                                if (this.a[this.d][12] < 0) {
                                    if (!this.a(this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 512)) break;
                                    this.a[this.d][2] = 2;
                                    break;
                                }
                                int[] nArray = this.a[this.d];
                                nArray[12] = nArray[12] - 1;
                                break;
                            }
                            case 0: {
                                this.a[this.d][3] = 0;
                                if (!this.a(this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 512)) break;
                                this.a[this.d][2] = 2;
                                break;
                            }
                            case 7: {
                                if (!this.a(this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 256, 0)) break;
                                this.a[this.d][3] = 0;
                                this.a[this.d][10] = 0;
                                this.a[this.d][2] = 2;
                                this.a[this.d][11] = this.e;
                                com.mnemonicstudios.novusapp.j.h(this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 16);
                                com.mnemonicstudios.novusapp.n.a(5);
                                int[] nArray = this.b[7];
                                nArray[2] = nArray[2] + 1;
                                this.b[7][0] = this.c(7);
                                com.mnemonicstudios.novusapp.n.a.W = 1;
                                com.mnemonicstudios.novusapp.n.a.Q = 16;
                                break;
                            }
                            case 1: {
                                if (!this.a(this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 256)) break;
                                this.a[this.d][3] = 0;
                                this.a[this.d][10] = 0;
                                this.a[this.d][2] = 2;
                                this.a[this.d][11] = this.e;
                                com.mnemonicstudios.novusapp.j.h(this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 16);
                                com.mnemonicstudios.novusapp.n.a.b(this.e >> 8, this.a[this.d][9], 1);
                                com.mnemonicstudios.novusapp.n.a(5);
                                break;
                            }
                            case 2: {
                                if (!this.a(this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 256)) break;
                                this.a[this.d][3] = 0;
                                this.a[this.d][10] = 0;
                                this.a[this.d][2] = 0;
                                this.a[this.d][11] = this.e;
                                com.mnemonicstudios.novusapp.j.h(this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 16);
                                com.mnemonicstudios.novusapp.n.a.d(this.e >> 8, this.e & 0xFF, com.mnemonicstudios.novusapp.n.a(30) + 20);
                                com.mnemonicstudios.novusapp.n.a(5);
                                int[] nArray = this.b[2];
                                nArray[2] = nArray[2] + 1;
                                this.b[2][0] = this.c(2);
                                com.mnemonicstudios.novusapp.n.a(5);
                                break;
                            }
                        }
                        break;
                    }
                    case 2: {
                        switch (this.a[this.d][7]) {
                            case 10: {
                                int[] nArray = this.a[this.d];
                                nArray[3] = nArray[3] + 1;
                                if (this.a[this.d][3] <= 100) break;
                                this.a[this.d][2] = 0;
                                this.c(this.a[this.d][0] >> 16, this.a[this.d][1] >> 16);
                                break;
                            }
                            case 0: 
                            case 6: {
                                int[] nArray = this.a[this.d];
                                nArray[3] = nArray[3] + 1;
                                if (this.a[this.d][3] > 20) {
                                    int[] nArray2 = this.a[this.d];
                                    nArray2[3] = nArray2[3] + 1;
                                }
                                if (this.a[this.d][3] <= 40) break;
                                this.a[this.d][2] = 0;
                                this.c(this.a[this.d][0] >> 16, this.a[this.d][1] >> 16);
                                break;
                            }
                            case 1: {
                                int[] nArray = this.a[this.d];
                                nArray[10] = nArray[10] + 1;
                                if (this.a[this.d][10] <= 40) break;
                                this.a[this.d][2] = 0;
                                int[] nArray3 = this.b[1];
                                nArray3[2] = nArray3[2] + 1;
                                this.b[1][0] = this.c(1);
                                break;
                            }
                            case 7: {
                                int[] nArray = this.a[this.d];
                                nArray[10] = nArray[10] + 1;
                                if (this.a[this.d][10] <= 40) break;
                                this.a[this.d][2] = 0;
                            }
                        }
                        break;
                    }
                }
            }
            ++this.d;
        }
        return;
    }

    public final void c() {
        this.d = 0;
        while (this.d < this.a.length) {
            if (this.a[this.d][2] != 0) {
                switch (this.a[this.d][7]) {
                    case 8: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.M, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 0, 0);
                        com.mnemonicstudios.novusapp.n.a.a(this.a[this.d][8], this.a[this.d][0] >> 16, (this.a[this.d][1] >> 16) - 36, com.mnemonicstudios.novusapp.n.G);
                        break;
                    }
                    case 9: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.N, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 0, 0);
                        break;
                    }
                    case 10: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.v, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, this.a[this.d][3] & 1, 0);
                        com.mnemonicstudios.novusapp.n.a.a((100 - this.a[this.d][3]) / 10 + 1, (this.a[this.d][0] >> 16) - 6, (this.a[this.d][1] >> 16) - 15, com.mnemonicstudios.novusapp.n.H);
                        break;
                    }
                    case 0: 
                    case 6: {
                        if ((this.a[this.d][3] >> 1 & 1) == 0) {
                            com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.p, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 0, 0);
                            break;
                        }
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.q, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 0, 0);
                        com.mnemonicstudios.novusapp.n.a(2);
                        break;
                    }
                    case 1: {
                        if (this.a[this.d][2] == 3) {
                            com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.D, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, this.a[this.d][3] >> 1, 0);
                            break;
                        }
                        if (this.a[this.d][2] == 2) {
                            switch (com.mnemonicstudios.novusapp.j.c) {
                                case 0: {
                                    com.mnemonicstudios.novusapp.n.a.b((this.a[this.d][0] >> 16) - 8, (this.a[this.d][1] >> 16) - this.a[this.d][10] - 16, this.a[this.d][9], 0, 2);
                                    break;
                                }
                                case 1: 
                                case 2: {
                                    com.mnemonicstudios.novusapp.n.a.b((this.a[this.d][0] >> 16) - 8, (this.a[this.d][1] >> 16) + this.a[this.d][10] + 16, this.a[this.d][9], 0, 2);
                                }
                            }
                            break;
                        }
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.A, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, this.a[this.d][3] >> 1, 0);
                        break;
                    }
                    case 7: {
                        if (this.a[this.d][2] == 2) {
                            com.mnemonicstudios.novusapp.n.a.a(this.b[7][2], this.a[this.d][0] >> 16, (this.a[this.d][1] >> 16) - this.a[this.d][10] - 16, com.mnemonicstudios.novusapp.n.H);
                            break;
                        }
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.K, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, this.a[this.d][3] >> 1, 0);
                        break;
                    }
                    case 2: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.E, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, this.a[this.d][3] >> 1, 0);
                        break;
                    }
                    case 3: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.B, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, this.a[this.d][3] >> 1, 0);
                        break;
                    }
                    case 4: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.C, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, this.a[this.d][3] >> 1, 0);
                        break;
                    }
                    case 5: {
                        com.mnemonicstudios.novusapp.n.a.a(com.mnemonicstudios.novusapp.n.w, this.a[this.d][0] >> 16, this.a[this.d][1] >> 16, 0, 0);
                        com.mnemonicstudios.novusapp.n.a.a(this.a[this.d][8], this.a[this.d][0] >> 16, (this.a[this.d][1] >> 16) - 36, com.mnemonicstudios.novusapp.n.G);
                    }
                }
            }
            ++this.d;
        }
    }

    public final void c(int n2, int n3) {
        com.mnemonicstudios.novusapp.n.a(1);
        com.mnemonicstudios.novusapp.n.a.g(n2, n3, 32);
        com.mnemonicstudios.novusapp.n.a.a(16);
        com.mnemonicstudios.novusapp.n.a.b(n2, n3, 16);
    }
}

