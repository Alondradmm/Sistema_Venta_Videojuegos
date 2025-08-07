// API REST
const express = require("express");
const dotenv = require('dotenv');
const ejs = require('ejs');
const app = express();

// Cargar variables de entorno
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// BD
let productos = [
  {
    id: 1,
    nombre: "Minecraft",
    plataforma: "bx bx-desktop",
    precio: 1000,
    ultima_venta: "",
    img: "https://cdn.mobygames.com/3bf3dae2-8042-11ef-acb4-02420a00011c.webp",
    stock: 100
  },
  {
    id: 2,
    nombre: "Hollow Knight",
    plataforma: "bxl bx-steam",
    precio: 500,
    ultima_venta: "",
    img: "https://cdn.mobygames.com/covers/2209343-hollow-knight-playstation-4-front-cover.png",
    stock: 60
  },
  {
    id: 3,
    nombre: "Stardew Valley",
    plataforma: "bxl bx-steam",
    precio: 700,
    ultima_venta: "",
    img: "https://cdn.mobygames.com/covers/1647843-stardew-valley-ps-vita-front-cover.jpg",
    stock: 30
  },
  {
    id: 4,
    nombre: "It Takes Two",
    plataforma: "bxl bx-steam",
    precio: 400,
    ultima_venta: "",
    img: "https://cdn.mobygames.com/covers/10952961-it-takes-two-nintendo-switch-front-cover.jpg",
    stock: 60
  },
  {
    id: 5,
    nombre: "Mario Kart 8 Deluxe",
    plataforma: "bx bxs-joystick-alt",
    precio: 500,
    ultima_venta: "",
    img: "https://cdn.mobygames.com/0f39f2ce-ab8d-11ed-b165-02420a000198.webp",
    stock: 60
  },
];

// Listar Productos - Vista de Venta
app.get("/productos", (req, res) => {
    json_res = {
        success: true,
        count: productos.length,
        data: productos
    }
    res.render('productos', data = json_res)
    
})

// Calcular Total -> Id de producto -> Precio producto -> Cantidad * Precio
app.post("/productos/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const {cantidad} = req.body 
        const producto = productos.find(p => p.id===id)
        if (producto){
            const precioProducto = producto.precio
            if (Number(cantidad) <= 0){
                return res.status(400).json({success: false, message: "Cantidad no válida. El número debe ser positivo"})
            }
            if (Number(cantidad) > producto.stock){
                return res.status(400).json({success: false, message: `Solo hay ${producto.stock} copias disponibles`})
            }
            let total = precioProducto*cantidad
            return res.json({
                success: true,
                data: total
            })
        } else {
            return res.status(400).json({success: false, message: "Producto no seleccionado"})
        }
    } catch (error) {
        return res.status(500).json({success: false, message: "Algo sucedió con el servidor", error: error})
    }
})

app.post("/productos", (req, res) => {
    const {id, total, pago, cantidad} = req.body
    try {
        const producto = productos.find(p => p.id==id)
        if (Number(cantidad) > producto.stock){
            return res.status(400).json({success: false, message: `Solo hay ${producto.stock} copias disponibles`})
        } else {
            if (Number(pago) < Number(total)){
                return res.status(400).json({success: false, message: "Pago insuficiente"})
            } else {
                producto.stock -= Number(cantidad)
                producto.ultima_venta = new Date().toLocaleString()
                const cambio = Number(pago) - Number(total)
                return res.status(302).json({success: true, message:"Venta realizada. Cambio de $ " + cambio ,redirect: '/productos'})
            }
            
        }
    } catch (error) {
        return res.status(500).json({success: false, message: "Algo sucedió con el servidor", error: error})
    }
})

// Manejo de rutas no existentes
app.use((req, res) => {
    res.status(404).json({success: false, message: "La ruta no existe"})
})

app.listen(PORT, () => {
    console.log(`Servidor corriento en http://localhost:${PORT}`)
});