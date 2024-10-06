import WidthLayout from "@/components/commons/width-layout";
import ContactForm from "./_components/contact-form";

// Define the type for social media links
interface SocialMediaLink {
	name: string;
	url: string;
	icon: string;
}

const Page: React.FC = () => {
	return (
		<div className="w-full ">
			<WidthLayout>
				<div className="relative">
					<div className="text-black">
						<div className="px-4 pt-16 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
							<h2 className="text-3xl lg:text-4xl font-medium">
								Contact
								<span
									className={`relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl lg:text-2xl `}
									style={{ fontFamily: "Playwrite CU, sans-serif" }}>
									Weeshr
								</span>
							</h2>
							<p className="max-w-2xl pt-6 pb-6 m-auto text-dark w-full md:flex flex-wrap text-lg">
								Want to contact us? Choose an option below and well be happy to
								show you how we can transform companys web experience.
							</p>
						</div>
						<div className="mt-10 pt-8 mb-4 mx-auto sm:px-16 bg-white/70 rounded-lg backdrop-blur-sm lg:flex">
							<div className="text-start px-5 lg:w-6/12">
								<h2 className="text-lg text-dark font-semibold">
									Drop us a message
								</h2>
								<p className="mt-4 mb-4 text-muted-foreground w-full text-base">
									Have something to say? We are here to help. Fill up the form
									or send email or call phone.
								</p>
								<div className="flex items-center mt-8 space-x-2 text-muted-foreground ">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="#4145a7"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="white"
										aria-hidden="true"
										className="w-4 h-4">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"></path>
									</svg>
									<span>Lagos, Nigeria</span>
								</div>
								<div className="flex items-center mt-2 space-x-2 text-muted-foreground ">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="#4145a7"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="white"
										aria-hidden="true"
										className="w-4 h-4">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
									</svg>
									<a href="mailto:hello@weeshr.com">hello@weeshr.com</a>
								</div>
								<div className="flex items-center mt-2 space-x-2 text-muted-foreground ">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="#4145a7"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="white"
										aria-hidden="true"
										className="w-4 h-4">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"></path>
									</svg>
									<div className="lg:flex gap-2">
										<p>
											<a href="tel:+2348143093413">+2348143093413</a>
										</p>
										<p>
											<a href="tel:+2348104295016">+2348104295016</a>
										</p>
									</div>
								</div>
							</div>
							<div className="lg:w-6/12">
								<ContactForm />
							</div>
						</div>
					</div>
				</div>
			</WidthLayout>
		</div>
	);
};

export default Page;
