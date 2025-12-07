import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Share2, Copy, Check, Minus, Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { StarRating } from '@/components/products';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useProductStore, useCartStore, useAuthStore } from '@/store';
import { toast } from 'sonner';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, getProductComments, addComment, addRating, getUserRating } = useProductStore();
  const { addToCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);

  const product = products.find(p => p.id === id);
  const comments = product ? getProductComments(product.id) : [];
  const userRating = user && product ? getUserRating(product.id, user.id) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated || user?.role !== 'user') {
      toast.error('Please login as a user to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`);
  };

  const handleRating = (rating: number) => {
    if (!isAuthenticated || user?.role !== 'user') {
      toast.error('Please login to rate this product');
      return;
    }
    addRating(product.id, user!.id, rating);
    toast.success('Thanks for your rating!');
  };

  const handleComment = () => {
    if (!newComment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    if (!isAuthenticated || user?.role !== 'user') {
      toast.error('Please login to comment');
      return;
    }
    addComment(product.id, user!.id, user!.name, user?.avatar, newComment);
    setNewComment('');
    toast.success('Comment posted!');
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/product/${product.id}?ref=${product.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Breadcrumb */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                        selectedImage === index ? 'border-accent' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <Link to={`/shop?trader=${product.traderId}`} className="text-sm text-accent hover:underline">
                  {product.traderName}
                </Link>
                <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} readonly />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.ratingCount} reviews)</span>
                </div>
                <Badge variant="secondary">{product.sold} sold</Badge>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive">-{discount}%</Badge>
                  </>
                )}
              </div>

              <p className="text-muted-foreground">{product.description}</p>

              <Separator />

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.stock} available</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="hero" size="lg" className="flex-1" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={copyReferralLink}>
                    {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {/* Referral Code */}
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Referral Code</p>
                    <p className="font-mono font-semibold">{product.referralCode}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyReferralLink}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <section className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reviews & Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rate Product */}
                {isAuthenticated && user?.role === 'user' && (
                  <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <p className="font-medium">Rate this product</p>
                    <StarRating
                      rating={userRating?.rating || 0}
                      onRate={handleRating}
                      size="lg"
                    />
                    {userRating && (
                      <p className="text-sm text-muted-foreground">
                        You rated this product {userRating.rating} stars
                      </p>
                    )}
                  </div>
                )}

                {/* Add Comment */}
                {isAuthenticated && user?.role === 'user' && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleComment}>Post Comment</Button>
                  </div>
                )}

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={comment.userAvatar} />
                          <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No comments yet. Be the first to leave a review!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
