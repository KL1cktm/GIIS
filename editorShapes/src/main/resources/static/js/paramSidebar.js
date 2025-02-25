document.addEventListener("DOMContentLoaded", function () {
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    const sidebarCircle = new bootstrap.Offcanvas(document.getElementById("paramSidebarCircle"));
    const sidebarEllipse = new bootstrap.Offcanvas(document.getElementById("paramSidebarEllipse"));
    const sidebarHyperbola = new bootstrap.Offcanvas(document.getElementById("paramSidebarHyperbola"));
    const sidebarParabola = new bootstrap.Offcanvas(document.getElementById("paramSidebarParabola"));
    const sidebarBSpline = new bootstrap.Offcanvas(document.getElementById("paramSidebarBSpline"));
    const closeSidebarBtn = document.getElementById("closeSidebar");
    const closeSidebarEllipseBtn = document.getElementById("closeSidebarEllipse");
    const closeSidebarHyperbolaBtn = document.getElementById("closeSidebarHyperbola");
    const closeSidebarParabolaBtn = document.getElementById("closeSidebarParabola");
    const closeSidebarBSplineBtn = document.getElementById("closeSidebarBSpline");
    const openSidebarBtn = document.getElementById("openSidebar");
    const openSidebarEllipseBtn = document.getElementById("openSidebarEllipse");
    const openSidebarHyperbolaBtn = document.getElementById("openSidebarHyperbola");
    const openSidebarParabolaBtn = document.getElementById("openSidebarParabola");
    const openSidebarBSplineBtn = document.getElementById("openSidebarBSpline");

    dropdownItems.forEach(item => {
        item.addEventListener("click", function (event) {
            openSidebarBtn.style.display = "none";
            openSidebarEllipseBtn.style.display = "none";
            openSidebarHyperbolaBtn.style.display = "none";
            openSidebarParabolaBtn.style.display = "none";
            openSidebarBSplineBtn.style.display = "none";
            event.preventDefault();
            selectLine2 = this.dataset.alg;
            console.log("select line2&  " + selectLine2);
            console.log("select curveline2&  " + selectCurveLine);

            if (selectLine2 === "Circle") {
                radius = 10;
                sidebarCircle.show();
                openSidebarBtn.style.display = "none";
            } else {
                sidebarCircle.hide();
            }
            if (selectLine2 === "Ellipse") {
                sidebarEllipse.show();
            }
            if (selectLine2 === "Hyperbola") {
                sidebarHyperbola.show();
            }
            if (selectLine2 === "Parabola") {
                sidebarParabola.show();
            }
            if (selectLine2 === "B-spline") {
                sidebarBSpline.show();
            }
        });
    });

    closeSidebarBSplineBtn.addEventListener("click", function () {
        sidebarBSpline.hide();
    });

    openSidebarBSplineBtn.addEventListener("click", function () {
        sidebarBSpline.show();
        openSidebarBSplineBtn.style.display = "none";
    });

    document.getElementById("paramSidebarBSpline").addEventListener("hidden.bs.offcanvas", function () {
        openSidebarBSplineBtn.style.display = "block";
    });

    document.getElementById("saveParamsBSpline").addEventListener("click", function () {
        numberOfPoints = document.getElementById("param51").value;
        degree = document.getElementById("param52").value;
        console.log(`Число точек ${numberOfPoints}   Степень   ${degree}`);
    });

    closeSidebarParabolaBtn.addEventListener("click", function () {
        sidebarParabola.hide();
    });

    openSidebarParabolaBtn.addEventListener("click", function () {
        sidebarParabola.show();
        openSidebarParabolaBtn.style.display = "none";
    });

    document.getElementById("paramSidebarParabola").addEventListener("hidden.bs.offcanvas", function () {
        openSidebarParabolaBtn.style.display = "block";
    });

    document.getElementById("saveParamsParabola").addEventListener("click", function () {
        a = document.getElementById("param41").value;
        b = document.getElementById("param42").value;
        position = document.getElementById("param43").value;
        console.log(`Полуоси: ${a}, ${b}. Положение: ${position}`);
    });

    closeSidebarHyperbolaBtn.addEventListener("click", function () {
        sidebarHyperbola.hide();
    });

    openSidebarHyperbolaBtn.addEventListener("click", function () {
        sidebarHyperbola.show();
        openSidebarHyperbolaBtn.style.display = "none";
    });

    document.getElementById("paramSidebarHyperbola").addEventListener("hidden.bs.offcanvas", function () {
        openSidebarHyperbolaBtn.style.display = "block";
    });

    document.getElementById("saveParamsHyperbola").addEventListener("click", function () {
        a = document.getElementById("param31").value;
        b = document.getElementById("param32").value;
        position = document.getElementById("param33").value;
        console.log(`Полуоси: ${a}, ${b}. Положение: ${position}`);
    });

    closeSidebarEllipseBtn.addEventListener("click", function () {
        sidebarEllipse.hide();
    });

    openSidebarEllipseBtn.addEventListener("click", function () {
        sidebarEllipse.show();
        openSidebarEllipseBtn.style.display = "none";
    });

    document.getElementById("paramSidebarEllipse").addEventListener("hidden.bs.offcanvas", function () {
        openSidebarEllipseBtn.style.display = "block";
    });

    document.getElementById("saveParamsEllipse").addEventListener("click", function () {
        a = document.getElementById("param21").value;
        b = document.getElementById("param22").value;
        console.log(`Полуоси: ${a}, ${b}`);
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