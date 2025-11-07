-- Sample data for HuParfum database
-- Insert example products and admin user

-- Insert sample products (Algerian perfumes)
INSERT INTO `products` (`name`, `description`, `price`) VALUES
('عطر الورد البلدي', 'عطر فاخر مع رائحة الورد الجزائري الأصلي. رائحة دافئة وثابتة تدوم طول اليوم.', 2500),
('عطر العود الجزائري', 'عطر قديم الطريقة مع العود الثقيل والدافئ. مناسب للعيد والمناسبات.', 3500),
('عطر البرتقال والليمون', 'عطر منعش فاخر بنكهة الحمضيات. خفيف وعطري مناسب للصيف.', 1800),
('عطر الفانيليا والعسل', 'عطر حلو وناعم مع رائحة الفانيليا والعسل الطبيعي. مثالي للنساء.', 2200),
('عطر الزعفران الملكي', 'عطر أنيق مع رائحة الزعفران والمسك. حصري وفاخر جداً.', 4000);

-- Insert sample admin user (password: admin123 - already hashed in production)
-- Note: In production, use a strong password hash
INSERT INTO `admins` (`name`, `email`, `password`, `role`) VALUES
('هدى', 'houda@huparfum.com', '$2a$10$YOixf5fVvEiOjJD2qEXKP.uFMdwFUkq3G9zLJV5vL5qiJl6Zq8ete', 'super_admin');
