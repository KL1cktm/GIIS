document.addEventListener("DOMContentLoaded", function () {
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    const sidebarCircle = new bootstrap.Offcanvas(document.getElementById("paramSidebarCircle"));
    const closeSidebarBtn = document.getElementById("closeSidebar");
    const openSidebarBtn = document.getElementById("openSidebar");

    dropdownItems.forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            const algorithm = this.dataset.alg;
            console.log(algorithm);

            if (algorithm === "Circle") {
                radius = 10;
                sidebarCircle.show();
                openSidebarBtn.style.display = "none";
            } else {
                sidebarCircle.hide();
            }
        });
    });

    closeSidebarBtn.addEventListener("click", function () {
        sidebarCircle.hide();
    });

    openSidebarBtn.addEventListener("click", function () {
        sidebarCircle.show();
        openSidebarBtn.style.display = "none";
    });

    document.getElementById("paramSidebarCircle").addEventListener("hidden.bs.offcanvas", function () {
        openSidebarBtn.style.display = "block";
    });

    document.getElementById("saveParams").addEventListener("click", function () {
        radius = document.getElementById("param1").value;
        console.log(`Радиус: ${radius}`);
    });
});