import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Игры', icon: 'Gamepad2', count: 245 },
    { name: 'Подписки', icon: 'Crown', count: 89 },
    { name: 'Софт', icon: 'Laptop', count: 134 },
    { name: 'Карты оплаты', icon: 'CreditCard', count: 67 },
  ];

  const products = [
    {
      id: 1,
      name: 'Steam Gift Card 1000₽',
      price: 1050,
      discount: 5,
      image: '🎮',
      category: 'Игры',
      inStock: true,
      delivery: 'Мгновенно'
    },
    {
      id: 2,
      name: 'Xbox Game Pass Ultimate 3 месяца',
      price: 899,
      discount: 0,
      image: '🎯',
      category: 'Подписки',
      inStock: true,
      delivery: 'Мгновенно'
    },
    {
      id: 3,
      name: 'PlayStation Plus 12 месяцев',
      price: 4499,
      discount: 10,
      image: '🎮',
      category: 'Подписки',
      inStock: true,
      delivery: 'Мгновенно'
    },
    {
      id: 4,
      name: 'Spotify Premium 1 месяц',
      price: 299,
      discount: 0,
      image: '🎵',
      category: 'Подписки',
      inStock: true,
      delivery: 'Мгновенно'
    },
    {
      id: 5,
      name: 'Netflix Premium 1 месяц',
      price: 699,
      discount: 15,
      image: '📺',
      category: 'Подписки',
      inStock: true,
      delivery: 'Мгновенно'
    },
    {
      id: 6,
      name: 'Microsoft Office 365 Personal',
      price: 2299,
      discount: 20,
      image: '💼',
      category: 'Софт',
      inStock: true,
      delivery: 'Мгновенно'
    },
  ];

  const addToCart = (product: any) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-2xl">
                🎮
              </div>
              <span className="text-xl font-bold text-foreground">КупиКод</span>
            </div>
            
            <nav className="hidden md:flex gap-6">
              <a href="#catalog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Каталог
              </a>
              <a href="#games" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Игры
              </a>
              <a href="#subscriptions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Подписки
              </a>
              <a href="#help" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Помощь
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="User" size={20} />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-xs">
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Icon name="ShoppingCart" size={48} className="text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      {cartItems.map((item, index) => (
                        <Card key={index}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{item.image}</div>
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-sm font-bold text-primary">{item.price} ₽</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(index)}
                            >
                              <Icon name="Trash2" size={18} />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold">Итого:</span>
                          <span className="text-2xl font-bold text-primary">{totalPrice} ₽</span>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                          <Icon name="CreditCard" size={20} className="mr-2" />
                          Оформить заказ
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                          <Icon name="Zap" size={14} className="inline mr-1" />
                          Коды придут мгновенно после оплаты
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-background py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Цифровые товары с мгновенной доставкой
            </h1>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
              Игры, подписки, карты оплаты — получите код сразу после покупки
            </p>
            <div className="flex gap-2 max-w-xl mx-auto animate-fade-in">
              <Input
                placeholder="Поиск по каталогу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Icon name="Search" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all cursor-pointer hover-scale">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Icon name={category.icon as any} size={24} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} товаров</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" id="catalog">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Популярные товары</h2>
            <Tabs defaultValue="all" className="w-auto">
              <TabsList>
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="games">Игры</TabsTrigger>
                <TabsTrigger value="subscriptions">Подписки</TabsTrigger>
                <TabsTrigger value="software">Софт</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all hover-scale">
                <CardHeader className="p-0">
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 h-48 flex items-center justify-center text-7xl relative">
                    {product.image}
                    {product.discount > 0 && (
                      <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {product.category}
                  </Badge>
                  <CardTitle className="text-lg mb-3">{product.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Icon name="Zap" size={16} className="text-secondary" />
                    <span>{product.delivery}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discount > 0 && (
                        <span className="text-sm text-muted-foreground line-through mr-2">
                          {Math.round(product.price / (1 - product.discount / 100))} ₽
                        </span>
                      )}
                      <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary/90" 
                    onClick={() => addToCart(product)}
                  >
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    В корзину
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="Zap" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Мгновенная доставка</h3>
              <p className="text-muted-foreground">
                Получите код сразу после оплаты на вашу почту
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-secondary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Гарантия качества</h3>
              <p className="text-muted-foreground">
                Все коды проверены и активируются с первого раза
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="Headphones" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Поддержка 24/7</h3>
              <p className="text-muted-foreground">
                Наша служба поддержки всегда на связи
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-12 bg-card">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-2xl">
                  🎮
                </div>
                <span className="text-xl font-bold">КупиКод</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Цифровые товары с мгновенной доставкой
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Игры</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Подписки</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Софт</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Карты оплаты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Правила</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Личный кабинет</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Мои заказы</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">История покупок</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Избранное</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Настройки</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 КупиКод. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
