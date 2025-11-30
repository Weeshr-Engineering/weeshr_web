import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import {
  SelectTrigger,
  SelectContent,
  SelectValue,
  Select,
  SelectItem,
} from "@/components/ui/select";

("use client");

interface ReceiverFormFieldsProps {
  formData: {
    countryCode: string;
    phoneNumber: string;
    address: string;
    deliveryDate: string;
    email: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const countryCodes = [
  { code: "+234", flag: "NG", country: "Nigeria" },
  { code: "+233", flag: "GH", country: "Ghana" },
  { code: "+254", flag: "KE", country: "Kenya" },
  { code: "+27", flag: "ZA", country: "South Africa" },
  { code: "+1", flag: "US", country: "USA" },
  { code: "+44", flag: "GB", country: "UK" },
  { code: "+33", flag: "FR", country: "France" },
  { code: "+49", flag: "DE", country: "Germany" },
];

export function ReceiverFormFields({
  formData,
  onInputChange,
}: ReceiverFormFieldsProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Select a date";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4 flex-1 overflow-y-auto">
      {/* Phone */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Phone Number</Label>
        <div className="flex gap-2">
          <Select
            value={formData.countryCode}
            onValueChange={(v) => onInputChange("countryCode", v)}
          >
            <SelectTrigger className="w-24 rounded-xl h-12 border-2">
              <SelectValue>
                <span className="flex items-center gap-1">
                  <span>
                    {
                      countryCodes.find((c) => c.code === formData.countryCode)
                        ?.flag
                    }
                  </span>
                  <span className="text-xs">{formData.countryCode}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                    <span className="text-xs text-gray-500">{c.country}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange("phoneNumber", e.target.value)}
            placeholder="Enter phone number"
            className="flex-1 rounded-xl h-12 border-2"
            required
          />
        </div>
      </div>
      {/* Email */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Email Address</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          placeholder="Enter email address"
          className="rounded-xl h-12 border-2"
          required
        />
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">
          Delivery Address
        </Label>
        <Input
          value={formData.address}
          onChange={(e) => onInputChange("address", e.target.value)}
          placeholder="Enter full delivery address"
          className="rounded-xl h-12 border-2"
          required
        />
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Delivery Date</Label>
        <Input
          type="date"
          value={formData.deliveryDate}
          onChange={(e) => onInputChange("deliveryDate", e.target.value)}
          className="rounded-xl h-12 border-2"
          required
          min={new Date().toISOString().split("T")[0]}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {formatDate(formData.deliveryDate)}
        </div>
      </div>
    </div>
  );
}
