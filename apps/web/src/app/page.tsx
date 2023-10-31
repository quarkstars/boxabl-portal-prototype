import Image from "next/image";
import AuthForm from "../components/auth-form";
import Login from "../components/login";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../components/ui/tabs";
import { landingPoints, landingTitle } from "../data/data";

export default function HomePage() {
	return (
		<div className="flex flex-col items-center h-screen min-h-screen bg-slate-900">
			<div className="top-0 w-full px-4 py-2 text-center bg-primary text-primary-foreground">
				<span className="font-bold">3d 4h 2m 2s left</span> to get up to 95%
				bonus shares
			</div>
			<div className="w-full pt-10 lg:grid lg:grid-cols-2 lg:min-h-screen lg:pt-0">
				<div className="flex items-center justify-center px-8 lg:hidden bg-slate-900">
					<div className="pb-10 mx-auto space-y-6 w-96">
						<Image
							alt="Boxabl"
							src="/boxabl.svg"
							width={150}
							height={75}
							className="mx-auto"
						/>
						<h1 className="text-2xl font-bold text-center text-white lg:text-left lg:text-5xl">
							{landingTitle}
						</h1>
						<div className="p-6 bg-white border-t-2 rounded-sm shadow-lg border-t-primary">
							<h4 className="w-full pb-4 text-xl font-bold text-center">
								Investor Portal
							</h4>
							<div className="w-full mx-auto space-y-6">
								<AuthForm />
							</div>
						</div>
					</div>
				</div>
				<div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-slate-900">
					<div className="mx-auto space-y-6 w-96">
						<Image
							alt="Boxabl"
							src="/boxabl.svg"
							width={150}
							height={75}
							className="mx-auto"
						/>
						<h1 className="text-4xl font-bold text-white">{landingTitle}</h1>
						<div className="space-y-6">
							{landingPoints.map((point) => {
								return (
									<div className="flex items-start space-x-4" key={point.title}>
										<svg
											className="w-6 h-6  text-primary"
											fill="none"
											height="24"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											width="24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
											<polyline points="22 4 12 14.01 9 11.01" />
										</svg>
										<div>
											<h3 className="text-lg font-semibold tracking-widest uppercase text-primary">
												{point.title}
											</h3>
											<p className="text-zinc-200">{point.description}</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-white">
					<div className="py-6 mx-auto space-y-6 w-96">
						<h4 className="w-full text-xl font-bold text-center">
							Investor Portal
						</h4>
						<AuthForm />
					</div>
				</div>
			</div>
		</div>
	);
}
