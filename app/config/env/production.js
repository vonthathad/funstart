module.exports = {
    // db: 'mongodb://admin:funbegin@23.88.239.10:61511/funstart',
    db: 'mongodb://admin:funbegin@127.0.0.1:61511/funstart',
    sessionSecret: 'PDLDHAHQTVTD',
    key: {
        privateKey: 'CaS4mWZDOVghh122',
        tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
    },
    token: {
        guest: 'CRv1o8FaogFa2SYU4F6Z9DzytqL1l4My'
    },
    facebook: {
        clientID: '170584416691811',
        clientSecret: '3a3cabfcbe1fcc2782b977aae1787d6c',
        callbackURL: '/oauth/facebook/callback',
        profileFields: ['id', 'displayName', 'email', 'gender']
    },
    twitter: {
        consumerKey: 'M0bLQIqMjpD3YdwxSMFqmJjAQ',
        consumerSecret: '0mbGODRgKV2waKwjCan1B19ZOF5bhA1KHzzfYQgwszTkrZer62',
        callbackURL: '/oauth/twitter/callback',
        profileFields: ['id', 'displayName', 'email', 'gender']
    },
    email: {
        username: "funstart.net",
        password: "brandnew123",
        accountName: "Fun Start",
        verifyEmailUrl: "action/verify",
        resetPasswordUrl: "action/reset"
    },
    server: {
        host: process.env.PROTOCOL+'://'+process.env.CHANNEL+'.'+process.env.DOMAIN,
        port: process.env.PORT,
        channel: process.env.CHANNEL
    },
    app: {
        id: '170584416691811',
        name: 'Hot Game',
        description: 'Burn them all!',
        url: process.env.PROTOCOL+'://'+process.env.CHANNEL+'.'+process.env.DOMAIN,
        image: process.env.PROTOCOL+'://'+process.env.CHANNEL+'.'+process.env.DOMAIN+'/sources/ads.jpg'
    }
}