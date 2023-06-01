test_booleans_1: {
    input:  {
        var a = !0;
        var b = !1;
    }
    want: {
        var a = true;
        var b = false;
    }
}
