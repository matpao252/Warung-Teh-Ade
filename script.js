// ========================================
// DATA KERANJANG
// ========================================

let cart = [];


// ========================================
// MENGAMBIL SEMUA TOMBOL TAMBAH
// ========================================

const addButtons = document.querySelectorAll(".menu-content button");


// ========================================
// EVENT TOMBOL TAMBAH
// ========================================

addButtons.forEach((button) => {

    button.addEventListener("click", function () {

        // Mengambil card menu
        const menuCard = this.closest(".menu-card");

        // Mengambil informasi produk
        const name = menuCard.querySelector("h3").textContent;

        const description = menuCard.querySelector("p").textContent;

        const priceText = menuCard.querySelector("strong").textContent;

        // Mengubah harga dari teks menjadi angka
        const price = parseInt(
            priceText.replace(/\D/g, "")
        );

        // Mengecek apakah produk sudah ada
        const existingProduct = cart.find(
            (item) => item.name === name
        );


        if (existingProduct) {

            // Jika sudah ada, tambah jumlah
            existingProduct.quantity += 1;

        } else {

            // Jika belum ada, masukkan produk baru
            cart.push({
                name: name,
                description: description,
                price: price,
                quantity: 1
            });

        }


        // Memperbarui tampilan keranjang
        updateCart();

        // Menampilkan notifikasi
        showNotification(`${name} ditambahkan ke keranjang`);

    });

});


// ========================================
// MEMBUAT KERANJANG
// ========================================

const cartContainer = document.createElement("div");

cartContainer.classList.add("cart-container");

cartContainer.innerHTML = `

    <div class="cart-header">

        <h3>🛒 Keranjang</h3>

        <button id="close-cart">
            ×
        </button>

    </div>

    <div id="cart-items">

        <p class="empty-cart">
            Keranjang masih kosong.
        </p>

    </div>

    <div class="cart-footer">

        <div class="cart-total">

            <span>Total</span>

            <strong id="cart-total-price">
                Rp0
            </strong>

        </div>

        <button id="clear-cart">
            Kosongkan Keranjang
        </button>

        <button id="checkout-button">
            Pesan Sekarang
        </button>

    </div>

`;

document.body.appendChild(cartContainer);


// ========================================
// TOMBOL KERANJANG
// ========================================

const cartButton = document.createElement("button");

cartButton.classList.add("floating-cart");

cartButton.innerHTML = `
    🛒
    <span id="cart-count">0</span>
`;

document.body.appendChild(cartButton);


// ========================================
// MEMBUKA KERANJANG
// ========================================

cartButton.addEventListener("click", function () {

    cartContainer.classList.add("active");

});


// ========================================
// MENUTUP KERANJANG
// ========================================

document
    .getElementById("close-cart")
    .addEventListener("click", function () {

        cartContainer.classList.remove("active");

    });


// ========================================
// UPDATE KERANJANG
// ========================================

function updateCart() {

    const cartItems = document.getElementById("cart-items");

    const cartCount = document.getElementById("cart-count");

    const cartTotalPrice =
        document.getElementById("cart-total-price");


    // Menghapus isi sebelumnya
    cartItems.innerHTML = "";


    // Jika keranjang kosong
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Keranjang masih kosong.
            </p>
        `;

        cartCount.textContent = "0";

        cartTotalPrice.textContent = "Rp0";

        return;
    }


    let total = 0;

    let totalQuantity = 0;


    // Menampilkan produk
    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        totalQuantity += item.quantity;


        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <p>
                    Rp${formatRupiah(item.price)}
                </p>

            </div>


            <div class="quantity-control">

                <button
                    onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>


            <strong>
                Rp${formatRupiah(itemTotal)}
            </strong>

        `;


        cartItems.appendChild(cartItem);

    });


    // Update jumlah item
    cartCount.textContent = totalQuantity;


    // Update total
    cartTotalPrice.textContent =
        "Rp" + formatRupiah(total);

}


// ========================================
// TAMBAH JUMLAH PRODUK
// ========================================

function increaseQuantity(index) {

    cart[index].quantity += 1;

    updateCart();

}


// ========================================
// KURANGI JUMLAH PRODUK
// ========================================

function decreaseQuantity(index) {

    cart[index].quantity -= 1;


    // Jika jumlah menjadi 0
    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    updateCart();

}


// ========================================
// KOSONGKAN KERANJANG
// ========================================

document
    .getElementById("clear-cart")
    .addEventListener("click", function () {

        cart = [];

        updateCart();

    });


// ========================================
// FORMAT RUPIAH
// ========================================

function formatRupiah(number) {

    return number.toLocaleString("id-ID");

}


// ========================================
// NOTIFIKASI
// ========================================

function showNotification(message) {

    const notification =
        document.createElement("div");

    notification.classList.add("notification");

    notification.textContent = "✓ " + message;


    document.body.appendChild(notification);


    setTimeout(() => {

        notification.classList.add("show");

    }, 10);


    setTimeout(() => {

        notification.classList.remove("show");

        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 2000);

}


// ========================================
// CHECKOUT
// ========================================

document
    .getElementById("checkout-button")
    .addEventListener("click", function () {

        if (cart.length === 0) {

            alert(
                "Keranjang masih kosong. Silakan pilih menu terlebih dahulu."
            );

            return;

        }


        let message =
            "Halo Teh Ade! Saya ingin memesan:%0A%0A";


        let total = 0;


        cart.forEach((item) => {

            const itemTotal =
                item.price * item.quantity;

            total += itemTotal;


            message +=
                `• ${item.name} x${item.quantity} = Rp${formatRupiah(itemTotal)}%0A`;

        });


        message +=
            `%0ATotal: Rp${formatRupiah(total)}`;


        // Nomor WhatsApp kedai
        const phoneNumber = "6283811651539";


        const whatsappURL =
            `https://wa.me/${phoneNumber}?text=${message}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    });