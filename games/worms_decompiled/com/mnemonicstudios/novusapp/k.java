/*
 * Decompiled with CFR 0.152.
 */
package com.mnemonicstudios.novusapp;

import com.mnemonicstudios.novusapp.j;
import com.mnemonicstudios.novusapp.n;

public final class k {
    static int a;
    static int b;
    static int c;
    static int d;
    static int e;
    int f;
    int g;
    int h;
    int i;
    int j;
    int k;
    int l;

    public final void a(int n2) {
        try {
            switch (n2) {
                case 0: {
                    a = 0;
                    this.l = 256;
                    this.i = 0;
                    break;
                }
                case 1: {
                    a = 256;
                    this.l = 512;
                    break;
                }
                case 2: {
                    a = 512;
                    this.l = 768;
                    break;
                }
                case 3: {
                    a = 768;
                    this.l = 1024;
                }
            }
            while (a < this.l) {
                this.h = n.a(1);
                this.i = n.a(3);
                switch (this.i) {
                    case 0: 
                    case 1: {
                        this.j = 128;
                        this.k = 5;
                        break;
                    }
                    case 2: {
                        this.j = 256;
                        this.k = 4;
                    }
                }
                for (c = 0; c < this.j; ++c) {
                    d = com.mnemonicstudios.novusapp.j.j[c << this.k & 0xFFF];
                    if ((d >>= 11 - this.h) < 0) {
                        d = -d;
                    }
                    if (d == 0) continue;
                    this.f = com.mnemonicstudios.novusapp.j.b(a + c, 0);
                    for (e = 1; e < 511; ++e) {
                        if (e < 511) {
                            this.g = com.mnemonicstudios.novusapp.j.b(a + c, e);
                            if (this.g != this.f && this.g == 0) {
                                for (b = 0; b < d; ++b) {
                                    com.mnemonicstudios.novusapp.j.e(a + c, e, b + e);
                                }
                                e += d + 2;
                            }
                        }
                        this.f = this.g;
                    }
                }
                a += this.j;
            }
            return;
        }
        catch (Exception exception) {
            Exception exception2 = exception;
            exception.printStackTrace();
            return;
        }
    }
}

