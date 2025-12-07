import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCartStore, useAuthStore, useProductStore } from '@/store';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addOrder } = useProductStore();

  if (!isAuthenticated || user?.role !== 'user') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Please Login</h1>
            <p className="text-muted-foreground mb-4">Login as a user to view your cart</p>
            <Button onClick={() => navigate('/login')}>Login</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const total = getTotal();
  const shipping = total > 100 ? 0 : 9.99;
  const finalTotal = total + shipping;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    addOrder({
      userId: user!.id,
      items: items,
      total: finalTotal,
      status: 'pending',
    });

    clearCart();
    toast.success('Order placed successfully!');
    navigate('/orders');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added any items yet
                </p>
                <Link to="/shop">
                  <Button variant="hero">
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <Link to={`/product/${item.product.id}`}>
                              <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </Link>
                            
                            <div className="flex-1 min-w-0">
                              <Link to={`/product/${item.product.id}`}>
                                <h3 className="font-semibold hover:text-accent transition-colors line-clamp-1">
                                  {item.product.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                {item.product.traderName}
                              </p>
                              <p className="text-lg font-bold mt-1">
                                ${item.product.price.toFixed(2)}
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <p className="text-sm font-semibold">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                </div>

                {/* Order Summary */}
                <div>
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      {shipping > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Free shipping on orders over $100
                        </p>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                      <Button variant="hero" size="lg" className="w-full" onClick={handleCheckout}>
                        Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Link to="/shop" className="block">
                        <Button variant="outline" className="w-full">
                          Continue Shopping
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
