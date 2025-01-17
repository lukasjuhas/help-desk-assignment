export default function FormFlowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-lg">{children}</div>
    </div>
  )
}
