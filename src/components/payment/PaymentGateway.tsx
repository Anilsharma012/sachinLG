import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode, 
  Wallet,
  Loader2,
  CheckCircle,
  Shield,
  IndianRupee,
  Banknote
} from "lucide-react";

interface PaymentGatewayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  loanAccountNo?: string;
  emiNumbers?: number[];
  onPaymentSuccess: (transactionId: string, mode: string) => void;
  allowCash?: boolean;
}

const upiApps = [
  { id: "gpay", name: "Google Pay", icon: "💳" },
  { id: "phonepe", name: "PhonePe", icon: "📱" },
  { id: "paytm", name: "Paytm", icon: "💰" },
  { id: "bhim", name: "BHIM", icon: "🏦" },
];

const banks = [
  { id: "sbi", name: "State Bank of India" },
  { id: "hdfc", name: "HDFC Bank" },
  { id: "icici", name: "ICICI Bank" },
  { id: "axis", name: "Axis Bank" },
  { id: "kotak", name: "Kotak Mahindra Bank" },
  { id: "pnb", name: "Punjab National Bank" },
];

export const PaymentGateway = ({
  open,
  onOpenChange,
  amount,
  loanAccountNo,
  emiNumbers = [],
  onPaymentSuccess,
  allowCash = false,
}: PaymentGatewayProps) => {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [gateway, setGateway] = useState<"razorpay" | "stripe">("razorpay");

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock transaction ID
    const txnId = `TXN${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    setIsProcessing(false);
    toast.success("Payment Successful!", {
      description: `Transaction ID: ${txnId}`,
    });
    
    onPaymentSuccess(txnId, paymentMethod);
    onOpenChange(false);
    
    // Reset form
    setUpiId("");
    setSelectedUpiApp("");
    setSelectedBank("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardName("");
  };

  const handleCashPayment = () => {
    toast.info("Cash Payment Request Sent", {
      description: "Please visit the office to complete the payment. A confirmation will be sent once recorded.",
    });
    onOpenChange(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateway
          </DialogTitle>
          <DialogDescription>
            {loanAccountNo && `Loan: ${loanAccountNo}`}
            {emiNumbers.length > 0 && ` • EMI #${emiNumbers.join(", #")}`}
          </DialogDescription>
        </DialogHeader>

        {/* Amount Display */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <p className="text-3xl font-bold text-primary flex items-center">
                  <IndianRupee className="h-6 w-6" />
                  {amount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                Secure Payment
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gateway Selection */}
        <div className="flex gap-2">
          <Button
            variant={gateway === "razorpay" ? "default" : "outline"}
            size="sm"
            onClick={() => setGateway("razorpay")}
            className="flex-1"
          >
            Razorpay
          </Button>
          <Button
            variant={gateway === "stripe" ? "default" : "outline"}
            size="sm"
            onClick={() => setGateway("stripe")}
            className="flex-1"
          >
            Stripe
          </Button>
        </div>

        {/* Payment Methods */}
        <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
          <TabsList className={`grid w-full ${allowCash ? "grid-cols-5" : "grid-cols-4"}`}>
            <TabsTrigger value="upi" className="gap-1">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">UPI</span>
            </TabsTrigger>
            <TabsTrigger value="card" className="gap-1">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Card</span>
            </TabsTrigger>
            <TabsTrigger value="netbanking" className="gap-1">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Bank</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="gap-1">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR</span>
            </TabsTrigger>
            {allowCash && (
              <TabsTrigger value="cash" className="gap-1">
                <Banknote className="h-4 w-4" />
                <span className="hidden sm:inline">Cash</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* UPI Payment */}
          <TabsContent value="upi" className="space-y-4">
            <div className="space-y-3">
              <Label>Select UPI App</Label>
              <div className="grid grid-cols-4 gap-2">
                {upiApps.map((app) => (
                  <Button
                    key={app.id}
                    variant={selectedUpiApp === app.id ? "default" : "outline"}
                    className="flex flex-col h-auto py-3"
                    onClick={() => setSelectedUpiApp(app.id)}
                  >
                    <span className="text-2xl">{app.icon}</span>
                    <span className="text-xs mt-1">{app.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="upi">Or enter UPI ID</Label>
              <Input
                id="upi"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          </TabsContent>

          {/* Card Payment */}
          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="JOHN DOE"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
              />
            </div>
          </TabsContent>

          {/* Net Banking */}
          <TabsContent value="netbanking" className="space-y-4">
            <Label>Select Bank</Label>
            <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
              <div className="grid grid-cols-2 gap-2">
                {banks.map((bank) => (
                  <div
                    key={bank.id}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedBank === bank.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedBank(bank.id)}
                  >
                    <RadioGroupItem value={bank.id} id={bank.id} />
                    <Label htmlFor={bank.id} className="cursor-pointer text-sm">
                      {bank.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </TabsContent>

          {/* QR Code */}
          <TabsContent value="qr" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                <div className="text-center">
                  <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    QR Code will appear here
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Scan with any UPI app to pay ₹{amount.toLocaleString()}
              </p>
            </div>
          </TabsContent>

          {/* Cash Payment */}
          {allowCash && (
            <TabsContent value="cash" className="space-y-4">
              <Card className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Banknote className="h-8 w-8 text-amber-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Pay at Office</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Visit our nearest office branch to pay ₹{amount.toLocaleString()} in cash. 
                        Your payment will be recorded by our staff and you'll receive a receipt.
                      </p>
                      <div className="mt-3 p-3 bg-background rounded-lg">
                        <p className="text-sm font-medium">Office Address:</p>
                        <p className="text-sm text-muted-foreground">
                          123 Finance Street, Loan Tower<br />
                          Mumbai, Maharashtra 400001<br />
                          Timing: 10 AM - 6 PM (Mon-Sat)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleCashPayment}
              >
                <Banknote className="h-4 w-4 mr-2" />
                Request Cash Payment
              </Button>
            </TabsContent>
          )}
        </Tabs>

        {/* Pay Button */}
        {paymentMethod !== "cash" && (
          <Button
            className="w-full"
            size="lg"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Pay ₹{amount.toLocaleString()}
              </>
            )}
          </Button>
        )}

        {/* Security Note */}
        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" />
          Your payment is secured with 256-bit encryption
        </p>
      </DialogContent>
    </Dialog>
  );
};
