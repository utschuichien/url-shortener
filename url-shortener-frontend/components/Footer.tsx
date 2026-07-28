export function Footer() {
    return (
        <footer className="w-full bg-background border-t-2 border-foreground pt-16 pb-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <h2 className="font-semibold text-xl mb-4 text-foreground">LinkFlow</h2>
                        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                            Shorten links, track performance, and share with confidence. Built with modern neobrutalism.
                        </p>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">Product</h3>
                        <ul className="space-y-3 font-medium text-muted-foreground text-sm">
                            <li><a href="#" className="hover:text-primary hover:underline decoration-2 underline-offset-4">Features</a></li>
                            <li><a href="#" className="hover:text-primary hover:underline decoration-2 underline-offset-4">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary hover:underline decoration-2 underline-offset-4">API</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">Company</h3>
                        <ul className="space-y-3 font-medium text-muted-foreground text-sm">
                            <li><a href="#" className="hover:text-primary hover:underline decoration-2 underline-offset-4">About</a></li>
                            <li><a href="#" className="hover:text-primary hover:underline decoration-2 underline-offset-4">Blog</a></li>
                            <li><a href="#" className="hover:text-primary hover:underline decoration-2 underline-offset-4">Careers</a></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">Legal</h3>
                        <ul className="space-y-3 font-medium text-muted-foreground text-sm">
                            <li><a href="#" className="hover:text-primary hover:underline decoration-2 underline-offset-4">Privacy</a></li>
                            <li><a href="#" className="hover:text-primary hover:underline decoration-2 underline-offset-4">Terms</a></li>
                            <li><a href="#" className="hover:text-primary hover:underline decoration-2 underline-offset-4">Report Abuse</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t-2 border-foreground pt-8 flex flex-col md:flex-row items-center justify-center text-center">
                    <p className="font-semibold text-sm text-muted-foreground">
                        © 2026 LinkFlow. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
