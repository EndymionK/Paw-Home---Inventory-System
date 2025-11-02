# Guía de Prueba: Productos con Stock Bajo y Notificaciones

## 🎯 HU Integradas

- **HU-4.1**: Detección de Stock Bajo
- **HU-4.2**: Notificaciones de Bajo Stock

## 📋 Descripción de la Integración

Esta integración conecta el frontend con los endpoints del backend para:
1. Obtener productos con el indicador de `stockBajo` calculado automáticamente
2. Mostrar notificaciones en tiempo real de productos con stock bajo
3. Resaltar visualmente productos que requieren reposición

## 🔧 Cambios Implementados

### Backend (Ya disponible en Render)
- ✅ `GET /api/inventory/productos` - Lista todos los productos con campo `stockBajo`
- ✅ `GET /api/inventory/productos/stock-bajo` - Lista solo productos con stock bajo
- ✅ `GET /api/inventory/notificaciones` - Lista notificaciones activas

### Frontend
1. **lib/products.ts**
   - Nuevas interfaces: `ProductoBackend`, `NotificacionBackend`
   - Función `fetchProducts()` - Obtiene productos del backend
   - Función `fetchLowStockProducts()` - Obtiene productos con stock bajo
   - Función `fetchNotificaciones()` - Obtiene notificaciones activas
   - Conversión automática de formato backend a frontend

2. **components/notification-system.tsx**
   - Integrado con endpoint `/api/inventory/notificaciones`
   - Actualización automática cada 30 segundos
   - Muestra notificaciones generadas por el backend

3. **components/product-table.tsx**
   - Icono de alerta ⚠️ para productos con stock bajo
   - Usa el campo `stockBajo` del backend
   - Resaltado visual mejorado

## 🧪 Cómo Probar en el Frontend

### Pre-requisitos
1. **Login exitoso** con admin/admin123 o juanmi/juanmi123
2. **Backend en Render** funcionando: https://petstore-backend-jrt5.onrender.com

### Prueba 1: Ver Productos con Indicador de Stock Bajo

1. **Navega a la página de productos** (`/products`)
2. **Verifica que se cargan productos del backend**:
   - Los productos deben venir del backend (no datos mock)
   - Si no hay productos, verás "No hay productos"
   
3. **Busca productos con stock bajo**:
   - Los productos con `stock <= umbralMinimo` deben mostrar:
     - ⚠️ Icono de alerta en color coral
     - Texto en color coral indicando "Stock bajo"
     - Badge con "Stock bajo"
     - Fondo ligeramente resaltado (si `highlightLowStock` está activado)

### Prueba 2: Sistema de Notificaciones

1. **Haz clic en el ícono de campana** 🔔 en la barra superior
2. **Verifica notificaciones**:
   - Si hay productos con stock bajo, verás notificaciones
   - Cada notificación muestra:
     - Nombre del producto
     - Stock actual
     - Umbral mínimo
     - Badge con estado (rojo si sin stock, amarillo si bajo)
   
3. **Verifica actualización automática**:
   - Las notificaciones se actualizan cada 30 segundos
   - El contador rojo aparece si hay notificaciones nuevas
   - Al abrir el menú, el contador se resetea

### Prueba 3: Productos con Stock Bajo (Endpoint Específico)

Para usar el endpoint específico de productos con stock bajo:

```typescript
// En cualquier componente del dashboard
import { fetchLowStockProducts } from "@/lib/products"

const productosStockBajo = await fetchLowStockProducts()
console.log("Productos con stock bajo:", productosStockBajo)
```

## 📊 Datos de Prueba en Backend

Para verificar que el backend tiene datos, puedes usar PowerShell:

```powershell
# Obtener productos
$token = "TU_TOKEN_JWT"
$headers = @{ Authorization = "Bearer $token" }

# Ver todos los productos
$productos = Invoke-RestMethod -Uri "https://petstore-backend-jrt5.onrender.com/api/inventory/productos" -Headers $headers
$productos | Format-Table codigo, nombre, stock, umbralMinimo, stockBajo

# Ver productos con stock bajo
$stockBajo = Invoke-RestMethod -Uri "https://petstore-backend-jrt5.onrender.com/api/inventory/productos/stock-bajo" -Headers $headers
$stockBajo | Format-Table codigo, nombre, stock, umbralMinimo, stockBajo

# Ver notificaciones
$notificaciones = Invoke-RestMethod -Uri "https://petstore-backend-jrt5.onrender.com/api/inventory/notificaciones" -Headers $headers
$notificaciones | Format-Table id, nombreProducto, stockActual, umbralMinimo
```

## 🔍 Verificación Visual

### Indicadores de Stock Bajo
- ✅ **Icono de alerta**: ⚠️ en color coral (#EA868F)
- ✅ **Texto de stock**: Color coral con "X unidades"
- ✅ **Umbral mínimo**: Texto pequeño "Mín: Y" en coral
- ✅ **Badge**: "Stock bajo" con variante secondary
- ✅ **Fondo de fila**: Resaltado suave en coral/10

### Sistema de Notificaciones
- ✅ **Campana con contador**: Punto rojo si hay notificaciones
- ✅ **Lista de notificaciones**: Muestra nombre, stock, umbral
- ✅ **Iconos**: AlertTriangle en amarillo (bajo) o rojo (agotado)
- ✅ **Mensaje contextual**: Diferentes para "agotado" vs "stock bajo"

## 🐛 Solución de Problemas

### No aparecen productos
- **Verifica**: Que hay productos en el backend
- **Solución**: Crear productos usando el endpoint POST /api/inventory/productos

### No aparecen notificaciones
- **Verifica**: Que hay productos con `stock <= umbralMinimo`
- **Verifica**: Que el umbralMinimo está configurado (no es null)
- **Solución**: Actualizar umbral usando PUT /api/inventory/productos/{id}/umbral-minimo

### Token expirado
- **Error**: HTTP 401 Unauthorized
- **Solución**: Hacer login nuevamente para obtener un token fresco

### Backend no responde
- **Verifica**: https://petstore-backend-jrt5.onrender.com/api/inventory/test
- **Espera**: Los servicios de Render pueden tardar ~30s en "despertar"

## 📝 Notas Técnicas

### Flujo de Datos
```
1. Usuario hace login → Recibe JWT token
2. Token se guarda en sessionStorage
3. Componentes llaman fetchProducts() o fetchNotificaciones()
4. Funciones agregan Authorization header con el token
5. Backend valida token y devuelve datos
6. Datos se convierten de formato backend a formato frontend
7. Componentes renderizan con los datos
```

### Conversión de Datos
```typescript
// Backend
{
  codigo: 1,
  nombre: "Croquetas",
  stock: 5,
  umbralMinimo: 10,
  stockBajo: true
}

// Frontend (después de conversión)
{
  id: "1",
  name: "Croquetas",
  stock: 5,
  minStock: 10,
  stockBajo: true
}
```

## ✅ Checklist de Verificación

- [ ] Login funciona y guarda token
- [ ] Productos se cargan desde backend
- [ ] Campo `stockBajo` se muestra correctamente
- [ ] Icono ⚠️ aparece en productos con stock bajo
- [ ] Sistema de notificaciones carga datos del backend
- [ ] Notificaciones se actualizan cada 30 segundos
- [ ] Contador de notificaciones no leídas funciona
- [ ] Productos sin umbral configurado no generan alertas falsas
- [ ] UI es responsive y accesible

## 🚀 Siguientes Pasos

Después de verificar esta integración:
1. **HU-3.1**: Integrar actualización de stock (aumentar/disminuir)
2. **HU-6.3**: Implementar renovación automática de tokens
3. **HU-7.1**: Mejorar accesibilidad visual (contraste, zoom)
