var express = require('express');
const router = express.Router();
const registerSchema1 = require('../model/user_schema');
const contactSchema1 = require('../model/contact_schema');
const uploadProdSchema1 = require('../model/uploadProd-schema');
const multer = require('multer');

// Home Page
router.get('/', async (req, res) => {
    try {
        // Fetch the latest 4 products sorted by creation date in ascending order (older to newer)
        const prodData = await uploadProdSchema1.find().sort({ createdAt: 1 }).limit(4);

        // Fetch the latest 4 products sorted by creation date in descending order (newer to older)
        const newerToOlderProdData = await uploadProdSchema1.find().sort({ createdAt: -1 }).limit(4);

        res.render('index', { prodData, newerToOlderProdData });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// iPhone 13 Pro Max Page/ Demo Page
router.get('/iphone-13-pro-max', (req, res) => {
    res.render('iphone-13-pro-max');
});

// Dashboard
router.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('admin-index');
    } else {
        res.redirect("/login");
    }
});

// Logout
router.get("/logout", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie("user_sid");
        res.redirect("/");
    } else {
        res.redirect("/login");
    }
});

// Login Pages
router.get('/login', (req, res) => {
    res.render('account');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await registerSchema1.findOne({ email }).exec();
        if (!user) {
            return res.redirect('/login'); // to handle non-existent user
        }

        user.comparePassword(password, (error, match) => {
            if (!match) {
                return res.redirect('/login'); // to handle incorrect password
            }
            req.session.user = user;
            res.redirect('/dashboard');
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error'); // Status code for error handling
    }
});

// Product Detail Page
router.get('/product-detail', (req, res) => {
    res.render('product-detail');
});

// File Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    cb(null, allowedFileTypes.includes(file.mimetype));
};
const upload = multer({ storage, fileFilter });

// Contact Us Pages
router.get('/contact-us', (req, res) => {
    res.render('contact-us');
});

router.post('/contact-us', (req, res) => {
    const contact = {
        fullName: req.body.fullName,
        emailAddress: req.body.emailAddress,
        message: req.body.message
    };

    const regpost1 = new contactSchema1(contact);
    regpost1.save()
        .then(() => res.json('Sent Successfully'))
        .catch(err => res.status(400).json('error:' + err));
});

// Upload Product Pages
router.get('/upload-products', (req, res) => {
    res.render('uploadProducts');
});

router.post('/upload-products', upload.single('prodImage'), (req, res) => {
    const uploadProduct = {
        prodImage: req.file.filename,
        prodName: req.body.prodName,
        prodCategory: req.body.prodCategory,
        prodOrgPrice: req.body.prodOrgPrice,
        prodDealPrice: req.body.prodDealPrice
    };

    const uploadProdPost = new uploadProdSchema1(uploadProduct);
    uploadProdPost.save()
        .then(() => res.json('Sent Successfully'))
        .catch(err => res.status(400).json('error:' + err));
});

router.get('/view-products', async (req, res) => {
    try {
        const prodData = await uploadProdSchema1.find({});
        res.render('view-prod', { prodData });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// View-Product Edit/Delete APIs (Commented Out)
// Uncomment and use if needed

// router.get("/delete/:id", async (req, res) => {
//     try {
//         await uploadProdSchema1.findByIdAndDelete(req.params.id);
//         res.redirect('/view-products');
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// router.get('/edit-product', (req, res) => {
//     res.render('edit-product');
// });

// router.get("/edit1/:id", async (req, res) => {
//     try {
//         const editProd = await uploadProdSchema1.findById(req.params.id);
//         res.render('edit-product', { editProd });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// router.post("/edit/:id", async (req, res) => {
//     const prodItemId = req.params.id;
//     const prodUpdatedData = {
//         prodName: req.body.prodName,
//         prodCategory: req.body.prodCategory,
//         prodOrgPrice: req.body.prodOrgPrice,
//         prodDealPrice: req.body.prodDealPrice
//     };

//     try {
//         const prodUpdate = await uploadProdSchema1.findByIdAndUpdate(prodItemId, prodUpdatedData, { new: true });
//         if (!prodUpdate) return res.status(404).json({ message: "Item not found!" });
//         res.redirect('/view-products');
//     } catch (err) {
//         res.status(500).json({ message: "Server Error!" });
//         console.log(err);
//     }
// });

// Show Product Details
router.get('/show/:id', async (req, res) => {
    try {
        const showData = await uploadProdSchema1.findById(req.params.id);
        res.render('product-detail', { showData });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// Register API
router.post('/register', upload.single('avatar'), (req, res) => {
    const register = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.file ? req.file.filename : undefined // Handle case where file might not be uploaded
    };

    const regpost = new registerSchema1(register);
    regpost.save()
        .then(() => res.json('Register Successful'))
        .catch(err => res.status(400).json('error:' + err));
});

// View-Registration Pages
router.get('/view-registration', async (req, res) => {
    try {
        const regdata = await registerSchema1.find({});
        res.render('view-registration', { regdata });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// View-Registration Delete API
router.get("/delete/:id", async (req, res) => {
    try {
        await registerSchema1.findByIdAndDelete(req.params.id);
        res.redirect('/view-registration');
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// View-Registration Edit API
router.get('/reg-edit-form', (req, res) => {
    res.render('reg-edit-form');
});

router.get("/edit/:id", async (req, res) => {
    try {
        const editData = await registerSchema1.findById(req.params.id);
        res.render('reg-edit-form', { editData });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/edit/:id", async (req, res) => {
    const regItemId = req.params.id;
    const regUpdatedData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    try {
        const regUpdate = await registerSchema1.findByIdAndUpdate(regItemId, regUpdatedData, { new: true });
        if (!regUpdate) return res.status(404).json({ message: "Item not found!" });
        res.redirect('/view-registration');
    } catch (err) {
        res.status(500).json({ message: "Server Error!" });
        console.log(err);
    }
});

module.exports = router;