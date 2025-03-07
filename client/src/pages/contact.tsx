import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Linkedin, MapPin, Mail, Phone, CheckSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  company: z.string().optional(),
  category: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      company: "",
      category: [],
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    });
    form.reset();
  }

  return (
    <div style={{ background: "#ffffff" }}>
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center">
            Contact Us
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Get in touch with our team. We're here to help with any questions or
            inquiries.
          </p>

          <div className="grid  gap-8 mb-16">
            {/* Contact Information Card */}

            {/* Contact Form Card */}
            <Card className="border-0 border-gray-900 bg-white">
              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">
                            Full Name<span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              {...field}
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">
                            Email<span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your email"
                              {...field}
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">
                            Company (if applicable)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your company name"
                              {...field}
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">
                            Phone<span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your phone number"
                              {...field}
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <h3 className="mb-2 text-sm font-medium text-gray-900">
                        Select a Category
                      </h3>
                      <div className="space-y-2">
                        {[
                          "Business Enquiry",
                          "Vendor Registration",
                          "Others",
                        ].map((category) => (
                          <div
                            key={category}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={category}
                              onCheckedChange={(checked) => {
                                const currentCategories =
                                  form.getValues("category") || [];
                                if (checked) {
                                  form.setValue("category", [
                                    ...currentCategories,
                                    category,
                                  ]);
                                } else {
                                  form.setValue(
                                    "category",
                                    currentCategories.filter(
                                      (cat) => cat !== category,
                                    ),
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={category}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">
                            Message<span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Your message"
                              {...field}
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 min-h-[120px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full md:w-auto md:float-right font-black border-2 border-black text-black uppercase bg-transparent hover:bg-transparent hover:text-[#01AEEF] hover:border-[#01AEEF] rounded-none px-8"
                      size="lg"
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <section className="w-screen relative left-[calc(-50vw+50%)] right-[calc(-50vw+50%)]">
            <div className="flex flex-col md:flex-row">
              {/* Map on the left - full height */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[600px] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1441.642329659654!2d77.45515859977496!3d28.60369933568113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cee63a6704d3b%3A0x46aa18502bb140e0!2sUrjatech%20Private%20Limited!5e0!3m2!1sen!2sus!4v1741311369250!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Urjatech"
                  className="absolute inset-0"
                ></iframe>
              </div>

              {/* Content on the right */}
              <div className="w-full md:w-1/2 bg-[#01AEEF] p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Visit Our Facility
                </h2>
                <p className="text-white mb-6">
                  We welcome you to visit our state-of-the-art manufacturing
                  facility in Ecotech-12, Greater Noida. Please contact us in
                  advance to schedule a visit.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-white flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-white">Address</h3>
                      <p className="text-white/90">
                        115, Ecotech-12, UP-201318, India
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-6 w-6 text-white flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-white">Phone</h3>
                      <p className="text-white/90">+91 8800094446</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-6 w-6 text-white flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-white">Email</h3>
                      <p className="text-white/90">cable@urjatech.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
