-- 🔧 PRODUCTOS DE EJEMPLO PARA TU TALLER
-- Ejecuta este script DESPUÉS de crear tu tenant y configurar Supabase
-- ✅ TENANT ID CONFIGURADO: 7eac9d78-ebe1-4a6e-82b6-001d34badc25

-- Tu tenant ID ya está configurado en todos los productos de abajo
-- Solo copia y pega este script completo en el SQL Editor de Supabase

INSERT INTO products (tenant_id, code, name, condition, price, original_price, description, features, image_url, stock, category, brand) VALUES

-- SIERRAS
('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'FC63-M1', 'Sierra Circular Makita 7-1/4"', 'Usado - Excelente', 89900, 120000, 'Sierra circular profesional Makita de 7-1/4 pulgadas. Motor potente de 15 AMP, cortes precisos hasta 2-5/8" a 90°. Ideal para carpintería y construcción.', 
ARRAY['Motor 15 AMP', 'Hoja 7-1/4"', 'Corte 90° hasta 2-5/8"', 'Base de aluminio', 'Freno eléctrico'], 
'/images/FC63-M1.avif', 1, 'Sierras', 'Makita'),

('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'DS165-M1', 'Sierra de Mesa DeWalt 10"', 'Nuevo', 450000, 520000, 'Sierra de mesa profesional DeWalt con motor de 15 AMP y capacidad de corte de 32-1/2". Perfecta para trabajos de precisión en el taller.', 
ARRAY['Motor 15 AMP', 'Hoja 10"', 'Capacidad 32-1/2"', 'Guía de precisión', 'Sistema anti-retroceso'], 
'/images/DS165-M1.webp', 1, 'Sierras', 'DeWalt'),

-- FRESADORAS
('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'MRF-M1', 'Fresadora de Mano Bosch', 'Usado - Buen Estado', 65000, 85000, 'Fresadora de mano Bosch de velocidad variable. Ideal para ranurado, perfilado y trabajos de detalle en madera.', 
ARRAY['Velocidad variable', 'Base ajustable', 'Guías incluidas', 'Motor 1.5 HP', 'Control de profundidad'], 
'/images/MRF-M1.webp', 1, 'Fresadoras', 'Bosch'),

('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'R3-K1', 'Fresadora de Inmersión Festool', 'Nuevo', 280000, 320000, 'Fresadora de inmersión Festool con sistema de guías. Precisión profesional para trabajos exigentes.', 
ARRAY['Sistema de guías', 'Motor EC-TEC', 'Extracción de polvo', 'Control electrónico', 'Base intercambiable'], 
'/images/R3-K1.webp', 1, 'Fresadoras', 'Festool'),

-- LIJADORAS
('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'BO5030-M1', 'Lijadora Orbital Makita', 'Usado - Excelente', 45000, 60000, 'Lijadora orbital Makita de 5" con sistema de extracción de polvo. Acabados profesionales garantizados.', 
ARRAY['Base 5"', 'Extracción de polvo', 'Velocidad variable', 'Empuñadura ergonómica', 'Sistema velcro'], 
'/images/BO5030-M1.png', 1, 'Lijadoras', 'Makita'),

('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'GST75E-B1', 'Lijadora de Banda Bosch', 'Usado - Buen Estado', 75000, 95000, 'Lijadora de banda Bosch 3"x21". Potente motor para desbaste y acabado de superficies grandes.', 
ARRAY['Banda 3"x21"', 'Motor 7.5 AMP', 'Control de velocidad', 'Bolsa recolectora', 'Empuñadura auxiliar'], 
'/images/GST75E-B1.webp', 1, 'Lijadoras', 'Bosch'),

-- PRENSAS
('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'PREF-M1', 'Prensa de Banco 6"', 'Usado - Excelente', 35000, 45000, 'Prensa de banco de 6 pulgadas. Construcción robusta en hierro fundido. Indispensable para cualquier taller.', 
ARRAY['Apertura 6"', 'Hierro fundido', 'Mordazas estriadas', 'Base giratoria', 'Yunque integrado'], 
'/images/PREF-M1.webp', 1, 'Prensas', 'Generic'),

('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'PST34-I1', 'Prensas Tipo F (Set 4)', 'Nuevo', 25000, 32000, 'Set de 4 prensas tipo F de diferentes tamaños. Ideales para encolado y sujeción de piezas.', 
ARRAY['Set de 4 unidades', 'Diferentes tamaños', 'Rosca Acme', 'Empuñadura ergonómica', 'Acabado anti-corrosión'], 
'/images/PST34-I1.webp', 4, 'Prensas', 'Generic'),

-- HERRAMIENTAS ELÉCTRICAS VARIAS
('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'M3700-M1', 'Multiherramienta Oscilante Makita', 'Usado - Excelente', 55000, 75000, 'Multiherramienta oscilante Makita con accesorios incluidos. Perfecta para cortes de precisión y lijado en espacios reducidos.', 
ARRAY['Velocidad variable', 'Cambio rápido de accesorios', 'Motor sin carbones', 'Kit de accesorios', 'Estuche incluido'], 
'/images/M3700-M1.avif', 1, 'Herramientas Eléctricas', 'Makita'),

('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'GTS10J-B1', 'Ingletadora Bosch 10"', 'Nuevo', 380000, 450000, 'Ingletadora deslizante Bosch de 10" con láser. Cortes precisos hasta 12" de ancho. Perfecta para molduras y marcos.', 
ARRAY['Hoja 10"', 'Sistema láser', 'Deslizamiento dual', 'Capacidad 12"', 'Mesa extensible'], 
'/images/GTS10J-B1.webp', 1, 'Sierras', 'Bosch'),

-- ACCESORIOS
('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'K5-K1', 'Kit de Brocas Profesional', 'Nuevo', 18000, 25000, 'Kit completo de brocas para madera y metal. Incluye estuche organizador y brocas de alta calidad.', 
ARRAY['50+ brocas incluidas', 'Madera y metal', 'Estuche organizador', 'Acero HSS', 'Diferentes diámetros'], 
'/images/K5-K1.jpg', 3, 'Accesorios', 'Generic'),

('7eac9d78-ebe1-4a6e-82b6-001d34badc25', 'SP6000-M1', 'Sierra de Inmersión Festool', 'Usado - Excelente', 320000, 380000, 'Sierra de inmersión Festool con guía de 1400mm. Cortes perfectamente rectos y precisos. Sistema de extracción integrado.', 
ARRAY['Guía 1400mm incluida', 'Corte hasta 55mm', 'Sistema anti-astillas', 'Extracción de polvo', 'Freno eléctrico'], 
'/images/SP6000-M1.webp', 1, 'Sierras', 'Festool');

-- Actualizar el stock total después de insertar
-- UPDATE tenants SET updated_at = NOW() WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
