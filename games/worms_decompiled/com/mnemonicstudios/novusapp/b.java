/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.i;
import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.n;
import javax.microedition.lcdui.Graphics;

/*
 * Duplicate member names - consider using --renamedupmembers true
 */
public final class b {
    int a;
    int[][] a;
    boolean[] a = new boolean[this.a];
    int b;
    int[][] b = new int[256][16];
    int c = 127;
    int d;
    int e;
    int f;
    int g;

    public final void a() {
        this.b = 0;
        while (this.b < this.a) {
            this.a[this.b] = false;
            ++this.b;
        }
    }

    public final int a(int n2, int n3, int n4, int n5, int n6, int n7, int n8, int n9, int n10, int n11, int n12) {
        if (this.c < 256) {
            ++this.c;
            this.b[this.c][0] = n2;
            this.b[this.c][14] = (n5 - n4 << 16) / (n12 + 1);
            this.b[this.c][15] = n3;
            this.b[this.c][5] = n4 << 16;
            this.b[this.c][8] = (n9 - n6 << 16) / (n12 + 1);
            this.b[this.c][9] = (n10 - n7 << 16) / (n12 + 1);
            this.b[this.c][10] = (n11 - n8 << 16) / (n12 + 1);
            this.b[this.c][11] = n6 << 16;
            this.b[this.c][12] = n7 << 16;
            this.b[this.c][13] = n8 << 16;
            return this.c;
        }
        return -1;
    }

    public final void a(int n2, int n3, int n4, int n5, int n6, int n7, int n8) {
        this.a(n2, n3, n4, n5, n6, n7, 0, n8);
    }

    public final void a(int n2, int n3, int n4, int n5, int n6, int n7, int n8, int n9) {
        this.a(n2, n3, n4, n5, n6, n7, n8, n9, 0, 0);
    }

    private void a(int n2, int n3, int n4, int n5, int n6, int n7, int n8, int n9, int n10, int n11) {
        try {
            this.b = 0;
            while (this.a[this.b] && this.b < this.a) {
                ++this.b;
            }
            if (this.b < this.a) {
                this.a[this.b] = true;
                this.a[this.b][0] = n3 << 16;
                this.a[this.b][1] = n4 << 16;
                this.a[this.b][16] = n3 << 16;
                this.a[this.b][17] = n4 << 16;
                this.a[this.b][2] = n2;
                this.a[this.b][3] = n7;
                this.a[this.b][4] = 0;
                this.a[this.b][6] = n5;
                this.a[this.b][7] = n6;
                this.a[this.b][18] = n8;
                this.a[this.b][19] = n9;
                this.a[this.b][20] = n10;
                this.a[this.b][21] = n11;
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    public final void a(int n2) {
        this.b = 0;
        while (this.b < n2) {
            if (this.a[this.b]) {
                this.a[this.b][16] = this.a[this.b][0];
                this.a[this.b][17] = this.a[this.b][1];
                int[] nArray = this.a[this.b];
                nArray[4] = nArray[4] + 1;
                if (this.a[this.b][4] > this.a[this.b][3]) {
                    this.a[this.b] = false;
                }
                if ((this.b[this.a[this.b][2]][0] & 1) > 0) {
                    int[] nArray2 = this.a[this.b];
                    nArray2[0] = nArray2[0] + this.a[this.b][6];
                }
                if ((this.b[this.a[this.b][2]][0] & 2) > 0) {
                    int[] nArray3 = this.a[this.b];
                    nArray3[1] = nArray3[1] + this.a[this.b][7];
                }
                if ((this.b[this.a[this.b][2]][0] & 4) > 0) {
                    int[] nArray4 = this.a[this.b];
                    nArray4[7] = nArray4[7] + 32768;
                }
            }
            ++this.b;
        }
    }

    public final void a(Graphics graphics, i i2, int n2, int n3) {
        this.f = n.a.c;
        this.g = n.a.d;
        graphics.setClip(0, 0, 240, 320);
        this.b = 0;
        while (this.b < n2) {
            if (this.a[this.b] && this.a[this.b][19] == n3 && this.a[this.b][2] >= 128) {
                this.d = this.b[this.a[this.b][2]][5] + this.b[this.a[this.b][2]][14] * this.a[this.b][4] >> 16;
                this.e = (this.b[this.a[this.b][2]][11] + this.b[this.a[this.b][2]][8] * this.a[this.b][4] >> 16 << 16) + (this.b[this.a[this.b][2]][12] + this.b[this.a[this.b][2]][9] * this.a[this.b][4] >> 16 << 8) + (this.b[this.a[this.b][2]][13] + this.b[this.a[this.b][2]][10] * this.a[this.b][4] >> 16);
                block0 : switch (j.c) {
                    case 0: {
                        switch (this.b[this.a[this.b][2]][15]) {
                            case 0: {
                                graphics.setColor(this.e);
                                graphics.fillArc((this.a[this.b][0] >> 16) - this.f - (this.d >> 1), (this.a[this.b][1] >> 16) - this.g - (this.d >> 1), this.d, this.d, 0, 360);
                                break;
                            }
                            case 1: {
                                graphics.setColor(this.e);
                                graphics.fillRect((this.a[this.b][0] >> 16) - this.f - (this.d >> 1), (this.a[this.b][1] >> 16) - this.g - (this.d >> 1), this.d, this.d);
                                break;
                            }
                            case 2: {
                                graphics.setColor(this.e);
                                graphics.drawLine((this.a[this.b][0] >> 16) - this.f, (this.a[this.b][1] >> 16) - this.g, (this.a[this.b][16] >> 16) - this.f, (this.a[this.b][17] >> 16) - this.g);
                                break;
                            }
                            case 3: {
                                graphics.setColor(this.e);
                                graphics.drawLine((this.a[this.b][0] >> 16) - this.f, (this.a[this.b][1] >> 16) - this.g, (this.a[this.b][16] >> 16) - this.f, (this.a[this.b][17] >> 16) - this.g);
                                break;
                            }
                            case 4: {
                                graphics.setColor(this.e);
                                if ((this.a[this.b][0] >> 16 & 1) == 0) {
                                    graphics.drawLine((this.a[this.b][0] >> 16) - this.f - (this.d >> 1), (this.a[this.b][1] >> 16) - this.g, (this.a[this.b][0] >> 16) - this.f + (this.d >> 1), (this.a[this.b][1] >> 16) - this.g);
                                    graphics.drawLine((this.a[this.b][0] >> 16) - this.f, (this.a[this.b][1] >> 16) - this.g - (this.d >> 1), (this.a[this.b][0] >> 16) - this.f, (this.a[this.b][1] >> 16) - this.g + (this.d >> 1));
                                    break;
                                }
                                graphics.drawLine((this.a[this.b][0] >> 16) - this.f - (this.d >> 1), (this.a[this.b][1] >> 16) - this.g - (this.d >> 1), (this.a[this.b][0] >> 16) - this.f + (this.d >> 1), (this.a[this.b][1] >> 16) - this.g + (this.d >> 1));
                                graphics.drawLine((this.a[this.b][0] >> 16) - this.f + (this.d >> 1), (this.a[this.b][1] >> 16) - this.g - (this.d >> 1), (this.a[this.b][0] >> 16) - this.f - (this.d >> 1), (this.a[this.b][1] >> 16) - this.g + (this.d >> 1));
                            }
                        }
                        break;
                    }
                    case 2: {
                        switch (this.b[this.a[this.b][2]][15]) {
                            case 0: {
                                graphics.setColor(this.e);
                                graphics.fillArc(240 - ((this.a[this.b][1] >> 16) - this.g - (this.d >> 1)) + 16, (this.a[this.b][0] >> 16) - this.f - (this.d >> 1), this.d, this.d, 0, 360);
                                break;
                            }
                            case 1: {
                                graphics.setColor(this.e);
                                graphics.fillRect(240 - ((this.a[this.b][1] >> 16) - this.g - (this.d >> 1)) + 16, (this.a[this.b][0] >> 16) - this.f - (this.d >> 1), this.d, this.d);
                                break;
                            }
                            case 2: {
                                graphics.setColor(this.e);
                                graphics.drawLine((this.a[this.b][0] >> 16) - this.f, (this.a[this.b][1] >> 16) - this.g, (this.a[this.b][16] >> 16) - this.f, (this.a[this.b][17] >> 16) - this.g);
                                break;
                            }
                            case 3: {
                                graphics.setColor(this.e);
                                graphics.drawLine((this.a[this.b][0] >> 16) - this.f, (this.a[this.b][1] >> 16) - this.g, (this.a[this.b][16] >> 16) - this.f, (this.a[this.b][17] >> 16) - this.g);
                            }
                        }
                        break;
                    }
                    case 1: {
                        switch (this.b[this.a[this.b][2]][15]) {
                            case 0: {
                                graphics.setColor(this.e);
                                graphics.fillArc((this.a[this.b][1] >> 16) - this.g - (this.d >> 1), (this.a[this.b][0] >> 16) - this.f - (this.d >> 1), this.d, this.d, 0, 360);
                                break block0;
                            }
                            case 1: {
                                graphics.setColor(this.e);
                                graphics.fillRect((this.a[this.b][1] >> 16) - this.g - (this.d >> 1), (this.a[this.b][0] >> 16) - this.f - (this.d >> 1), this.d, this.d);
                                break block0;
                            }
                            case 2: {
                                graphics.setColor(this.e);
                                graphics.drawLine((this.a[this.b][0] >> 16) - this.f, (this.a[this.b][1] >> 16) - this.g, (this.a[this.b][16] >> 16) - this.f, (this.a[this.b][17] >> 16) - this.g);
                                break block0;
                            }
                            case 3: {
                                graphics.setColor(this.e);
                                graphics.drawLine((this.a[this.b][0] >> 16) - this.f, (this.a[this.b][1] >> 16) - this.g, (this.a[this.b][16] >> 16) - this.f, (this.a[this.b][17] >> 16) - this.g);
                            }
                        }
                    }
                }
            }
            ++this.b;
        }
    }

    static {
        int[][][] nArrayArray = new int[][][]{new int[][]{{5, 5}, {-8, -5}, {5, -7}, {0, 4}}, new int[][]{{5, 0}, {-5, -1}, {-1, -8}, {3, 4}}, new int[][]{{10, 10}, {-15, -10}, {10, -15}, {0, 8}}};
    }
}

