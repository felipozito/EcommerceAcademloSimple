export default function showMenu() {
      navbar_list.classList.toggle("show_nav");
      if (navbar_list.classList.value.includes("show_nav")) {
            navbar.classList.add("sticky");
      } else {
            navbar.classList.remove("sticky");
      }
}
