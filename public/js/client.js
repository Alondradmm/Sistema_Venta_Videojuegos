// Función
function search() {
    let input = document.getElementById("searchProduct").value.toLowerCase();
    let items = document.querySelectorAll("#productList div");
    // Recorrido de los items (Foreach)
    items.forEach(item => {
        item.toggleAttribute('hidden', !item.textContent.toLowerCase().includes(input))
    });
}

function openProducts() {
    const list = document.getElementById("productList");
    list.hidden = false
}

function closeProducts() {
    const list = document.getElementById("productList");
    setTimeout(() => {
        list.hidden = true
    }, "300");
    
}

function setValue(nombre, productId) {
    let input = document.getElementById("searchProduct");
    let inputID = document.getElementById("productoId");
    input.value = nombre
    inputID.value = productId
    search()
    closeProducts()
}

document.getElementById("searchProduct").addEventListener("input", () => {
    document.getElementById("productoId").value = "0";
});

document.getElementById('calcularTotal').addEventListener('click', async () => {
    const id = document.getElementById("productoId").value;
    const cantidad = document.getElementById("productoCantidad").value;

    const response = await fetch(`/productos/${id}`, {
        method: "POST",
        body: JSON.stringify({
            cantidad: cantidad,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    
    const producto = await response.json()
    console.log(producto)
    if (producto.success){
        document.getElementById("total").value = producto.data;
        document.getElementById("message").hidden = true;
    } else {
        document.getElementById("message").hidden = false;
        document.getElementById("message").innerHTML = producto.message 
        document.getElementById("message").classList.replace("success", "error")
    }
    
});

document.getElementById('formVenta').addEventListener('submit', async function(event) {
    event.preventDefault()
    const formData = new FormData(event.target); // Captura automática de todos los inputs
    const formJson = new URLSearchParams(formData);
    const response = await fetch("/productos", {
        method: "POST",
        body: formJson
    });
    const responseMessage = await response.json()
    console.log(responseMessage)
    if (responseMessage.success){
        alert(responseMessage.message)
        window.location.href = responseMessage.redirect
    } else {
        document.getElementById("message").hidden = false;
        document.getElementById("message").innerHTML = responseMessage.message 
        document.getElementById("message").classList.replace("success", "error")
    }
});