const NaCl = require('tweetnacl');

module.exports = {
    signTransaction
}

function signTransaction(context, events, done) {
    const hex_bytes = context.vars['hex_bytes'];
    const private_key = "41d9523b87b9bd89a4d07c9b957ae68a7472d8145d7956a692df1a8ad91957a2c117d9dd874447f47306f50a650f1e08bf4bec2cfcb2af91660f23f2db912977";
    context.vars['public_key'] = "c117d9dd874447f47306f50a650f1e08bf4bec2cfcb2af91660f23f2db912977";

    const key_pair = NaCl.sign.keyPair.fromSecretKey(Buffer.from(private_key, "hex"))
    const secret_key = key_pair.secretKey;

    context.vars['signed_hex_bytes'] = Buffer.from(
        NaCl.sign.detached(
            Buffer.from(hex_bytes, "hex"),
            secret_key
        )
    ).toString("hex")

    return done();
}
