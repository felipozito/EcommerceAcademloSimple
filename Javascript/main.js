const iconTheme = document.querySelectorAll(".navbar_items i");
const navbar = document.querySelector(".navbar");
const navbar_list = document.querySelector(".navbar_label");
const shoppingCart = document.querySelector(".shopping_cart");
import products from "./data.js";
let total_list = products;
let mylist = [];

window.addEventListener("DOMContentLoaded", (event) => {
      loader();
      if (localStorage.getItem("db")) {
            const db = JSON.parse(localStorage.getItem("db"));
            total_list = db;
            AllProducts(total_list);
      } else {
            // localStorage.setItem("db", JSON.stringify(products));
            AllProducts(total_list);
      }
      //   AllProducts(products);
      if (localStorage.getItem("theme")) {
            document.body.classList.add("darkMode");
            iconTheme[1].classList.replace("bx-moon", "bx-sun");
      } else {
            document.body.classList.remove("darkMode");
            iconTheme[1].classList.replace("bx-sun", "bx-moon");
      }
      if (localStorage.getItem("cart")) {
            mylist = JSON.parse(localStorage.getItem("cart"));
      }

      printCart(mylist);
      //   console.log(localStorage.get("theme"));
});
function loader() {
      setTimeout(() => {
            document.querySelector(".loader_content").style.display = "none";
      }, 3000);
}
window.addEventListener("click", (e) => {
      const event = e.target.classList.value;
      const type = e.target.dataset.type;
      const item_id = e.target.parentNode.dataset.item;
      //   console.log(e.target.parentNode.classList.value);
      if (event.includes("bx bx-moon") || event.includes("bx bx-sun")) {
            darkmode(event);
      }
      if (event.includes("bx bx-cart") || event.includes("car_number")) {
            openCart();
      }
      if (event.includes("shopping_close")) {
            closeCart();
      }
      if (event.includes("bx bx-menu")) {
            showMenu();
      }
      if (type) {
            filterType(type, products);
      }
      if (item_id) {
            addCart(item_id, e.target.parentNode);
      }
      if (event.includes("bx-trash")) {
            deleteCart(e.target);
      }
      if (event.includes("bx-minus-circle")) {
            substractItem(e.target);
      }
      if (event.includes("bx-plus-circle")) {
            addItem(e.target);
      }
      if (e.target.parentNode.classList.value.includes("checkout")) {
            checkout();
      }
});

window.addEventListener("scroll", () => {
      const logo = document.querySelector(".nav_logo");
      if (window.scrollY == 0) {
            navbar.classList.remove("sticky");
            // logo.style.color = "var(--text_alert)";
      } else {
            navbar.classList.add("sticky");
            // logo.style.color = "var(--color_main)";
      }
});
function showMenu() {
      navbar_list.classList.toggle("show_nav");
      if (navbar_list.classList.value.includes("show_nav")) {
            navbar.classList.add("sticky");
      } else {
            navbar.classList.remove("sticky");
      }
}
function checkout() {
      mylist.forEach((item) => {
            total_list.forEach((product) => {
                  if (item.id == product.id) {
                        product.stock -= item.unit;
                  }
            });
      });
      mylist = [];
      localStorage.setItem("db", JSON.stringify(total_list));
      AllProducts(JSON.parse(localStorage.getItem("db")));
      printCart(mylist);
      localStorage.setItem("cart", JSON.stringify(mylist));
}
function addItem(event) {
      const id = event.parentNode.parentNode.parentNode.dataset.key;
      mylist.forEach((item) => {
            if (item.id == id) {
                  item.unit++;
            }
      });
      warningCart(mylist);
      printCart(mylist);
      localStorage.setItem("cart", JSON.stringify(mylist));
}
function substractItem(event) {
      const id = event.parentNode.parentNode.parentNode.dataset.key;
      mylist.forEach((item) => {
            if (item.id == id) {
                  item.unit--;
                  if (item.unit == 0) deleteCart(event.parentNode.parentNode);
            }
      });
      printCart(mylist);
      localStorage.setItem("cart", JSON.stringify(mylist));
}
function warningCart(list) {
      list.forEach((item) => {
            total_list.forEach((product) => {
                  if ((item.id == product.id) & (item.unit > product.stock)) {
                        item.unit--;
                        return alert("Not Enough Products");
                  }
            });
      });
}
function deleteCart(event) {
      const id = event.parentNode.dataset.key;
      const array_filter = mylist.filter((item) => item.id !== id);
      mylist = [...array_filter];
      printCart(mylist);
      localStorage.setItem("cart", JSON.stringify(mylist));
}
function addCart(id, event) {
      let info_item = {};
      total_list.forEach((item) => {
            if ((item.id == id) & (item.stock > 0)) {
                  info_item = {
                        id: event.getAttribute("data-item"),
                        name: event.querySelector(".card_text > h2").textContent,
                        price: event.querySelector(".card_title h2").textContent.replace(" $", ""),
                        img: event.querySelector(".card_img img").getAttribute("src"),
                        unit: 1,
                        stock: event.querySelector(".card_title > p").textContent,
                  };
                  if (mylist.some((item) => item.id == id)) {
                        const update_product = mylist.map((item) => {
                              if (item.id == id) {
                                    item.unit++;
                                    return item;
                              } else {
                                    return item;
                              }
                        });
                        mylist = [...update_product];
                  } else {
                        mylist = [...mylist, info_item];
                  }
                  warningCart(mylist);
                  printCart(mylist);
                  //   AllProducts(products);
            } else if ((item.id == id) & (item.stock == 0)) {
                  alert("We don't have units available");
            }
      });
      localStorage.setItem("cart", JSON.stringify(mylist));
      //   console.log(mylist);
}
function printCart(list) {
      const content = document.querySelector(".main_cart");
      const footer = document.querySelector(".footer_shopping");
      const items = document.querySelector(".car_number");
      const check = document.querySelector(".checkout");
      let count = 0;
      let total = 0;
      let empty = `
            <img src="./Assets/empty-cart.png" alt="">
            <p>Your cart is empty
                You can add items to your cart by clicking on the "" button on the product page.</p>
            `;
      if (list.length === 0) {
            content.innerHTML = empty;
            items.textContent = count;
            footer.innerHTML = `
            <h2>Items: 0</h2>
            <h2>Total: $0.00</h2>`;
            check.classList.add("disabled");
      } else {
            let html = "";
            list.forEach((item) => {
                  html += `
                  <div class="cart_card" data-key=${item.id}>
                    <div class="cart_img">
                        <img src='${item.img}'>
                    </div>
                    <div class="cart_card_text">
                        <h2>Name: ${item.name}</h2>
                        <h2 class="total">Subtotal: ${item.price * item.unit} $</h2>
                        <p>Stock: ${item.stock}</p>
                        <div class="cart_btn">
                            <i class='bx bx-minus-circle'></i>
                            <h2 class="units">${item.unit} units</h2>
                            <i class='bx bx-plus-circle'></i>
                        </div>
                    </div>
                    <i class='bx bx-trash'></i>
                  </div>
          `;
            });
            check.classList.remove("disabled");
            content.innerHTML = html;
            list.forEach((item) => (count += item.unit));
            list.forEach((item) => (total += item.unit * item.price));
            items.textContent = count;
            footer.innerHTML = `
                <h2>items: ${count}</h2>
                <h2>Total: $ ${total}</h2>
            `;
      }
      //   console.log(html);
}
function darkmode(event) {
      if (event.includes("bx bx-moon")) {
            iconTheme[1].classList.replace("bx-moon", "bx-sun");
            document.body.classList.add("darkMode");
            localStorage.setItem("theme", "darkMode");
      } else {
            iconTheme[1].classList.replace("bx-sun", "bx-moon");
            document.body.classList.remove("darkMode");
            localStorage.removeItem("theme");
      }
      if (localStorage.getItem("theme")) {
            console.log("asdasd");
      }
}
function openCart() {
      document.querySelector(".shopping_cart").classList.add("open_cart");
}
function closeCart() {
      document.querySelector(".shopping_cart").classList.remove("open_cart");
}
//---------------------------------------Carrito------------------------------------------
function AllProducts(products) {
      const content_products = document.querySelector(".products_list");
      let html = "";
      products.forEach((item, index) => {
            html += `
      <div class="card_product" data-item=${item.id}>
            <div class="card_img">
                <img src="${item.img}"  alt="${index}">
            </div>
            <div class="card_text">
                <div class="card_title">
                    <h2>${item.price} $</h2>
                    <p>| Stock: ${item.stock}</p>
                </div>
                <h2>${item.name}</h2>
            </div>
            <div class="card_btn">+</div>
      </div>
      `;
      });
      //   console.log(html);
      content_products.innerHTML = html;
}
function filterType(type, products) {
      const content_products = document.querySelector(".products_list");
      let html = "";
      content_products.innerHTML = html;
      let products_filter = products.filter((item) => item.type == type);
      if (type == "all") products_filter = products;
      products_filter.forEach((item, index) => {
            html += `
      <div class="card_product" data-item=${item.id}>
            <div class="card_img">
                <img src="${item.img}"  alt="${index}">
            </div>
            <div class="card_text">
                <div class="card_title">
                    <h2>${item.price} $</h2>
                    <p>| Stock: ${item.stock}</p>
                </div>
                <h2>${item.name}</h2>
            </div>
            <div class="card_btn">+</div>
      </div>
      `;
      });
      //   console.log(html);
      content_products.innerHTML = html;
}
