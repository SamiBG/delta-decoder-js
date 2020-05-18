function conversor(conv_val) {
    let size = conv_val.length;
    let addr_b10 = 0;
    let addr_d4 = "N/A"
    let addr_d8 = "N/A";
    let i = 0;

    if (size === 4) {
        addr_d4 = conv_val;
        addr_b10 = d4_to_b10(addr_d4);
        addr_d8 = d4_to_d8(addr_d4);
    } else if (size === 8) {
        addr_d8 = conv_val;
        addr_b10 = d8_to_b10(addr_d8);
        addr_d4 = d8_to_d4(addr_d8);

    } else if (size <= 2 && size > 0) {
        conv_val = parseInt(conv_val);
        addr_b10 = conv_val;
        let addr_b3 = "";

        //convert to base 3
        if (conv_val === 80 || conv_val === 0) {
            addr_b3 = "0000";
        } else if (conv_val > 0 && conv_val < 80) {
            addr_b3 = b10_to_b3(conv_val);
        } else {
            throw ("ERROR: Address out of bounds");
        }

        console.log(addr_b3);

        //b3 a D4
        if (!addr_b3.includes("1") && addr_b3.length === 4) {
            addr_d4 = addr_b3.replace(/0/g, "1").replace(/2/g, "0");
        }

        //b3 a D8
        if (addr_b3.length === 4) {
            addr_d8 = "";
            for (i = 0; i < addr_b3.length; i++) {
                let b = addr_b3.charAt(i);
                if (b === "0") {
                    addr_d8 = addr_d8 + "10";
                } else if (b === "1") {
                    addr_d8 = addr_d8 + "01";
                } else if (b === "2") {
                    addr_d8 = addr_d8 + "00";
                }
            }
        }
    }
    return {b10 : addr_b10, d4 : addr_d4, d8 : addr_d8};
}

function b10_to_b3(val_b10) {
    let val_b3 = "";
    while (val_b10 > 0) {
        val_b3 = val_b3 + (val_b10 % 3).toString();
        val_b10 = Math.floor(val_b10 / 3);
    }
    while (val_b3.length < 4){
        val_b3 = val_b3 + "0";
    }
    return val_b3;
}

function d8_to_d4(val_d8) {
    let delta;
    let dip;
    let val_d4 = "";
    let i = 0;
    while (i + 1 < val_d8.length) {
        delta = parseInt(val_d8[i]);
        dip = parseInt(val_d8[i + 1]);
        if (delta === 0 && dip === 0) {
            val_d4 = val_d4 + "0";
        } else if (delta === 1 && dip === 0) {
            val_d4 = val_d4 + "1";
        }
        i += 2;
    }
    if (val_d4.length === 4){
        return val_d4;
    }
    return "N/A";
}

function d4_to_d8(val_d4) {
    //00 -> 0
    //10 -> 1
    let val_d8 = "";
    for (let i = 0; i < val_d4.length; i++) {
        let b = val_d4.charAt(i);
        if (b === "0") {
            val_d8 = val_d8 + "00";
        } else if (b === "1") {
            val_d8 = val_d8 + "10";
        }
    }
    return val_d8;
}

function d4_to_b10(val_d4) {
    val_d4 = val_d4.replace(/0/g, "2").replace(/1/g, "0");
    let val_b10 = 0;
    let i = 0;
    while (i < val_d4.length) {
        val_b10 += parseInt(val_d4[i]) * Math.pow(3, i);
        i += 1;
    }
    return val_b10
}

function d8_to_b10(val_d8) {
    let delta;
    let dip;
    let base;
    let val_b10 = 0;
    let i = 0;
    while (i + 1 < val_d8.length) {
        delta = parseInt(val_d8[i]);
        dip = parseInt(val_d8[i + 1]);
        if (delta === 1 && dip === 1) {
            throw ("ERROR: Invalid DIP switches configuration");
        } else {
            base = 0
            if (delta === 0 && dip === 0) {
                base = 2
            } else if (delta === 0 && dip === 1) {
                base = 1
            }
            val_b10 += base * Math.pow(3, Math.trunc(i / 2))
            i += 2;
        }
    }
    return val_b10;
}