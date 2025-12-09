import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const petName = searchParams.get("petName") || "Your pet";
  const blurbRaw = searchParams.get("blurb") || "";
  const imageUrl = searchParams.get("image") || "";

  const blurb = blurbRaw.length > 160 ? blurbRaw.slice(0, 157) + "…" : blurbRaw;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg,#f5ebff 0%,#fdfbff 40%,#f4f0ff 100%)",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif',
        }}
      >
        <div
          style={{
            width: 1050,
            height: 500,
            backgroundColor: "#ffffff",
            borderRadius: 32,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
            display: "flex",
            padding: 40,
            gap: 32,
            alignItems: "center",
          }}
        >
          {/* LEFT: image */}
          <div
            style={{
              width: 340,
              height: 340,
              borderRadius: 24,
              overflow: "hidden",
              backgroundColor: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="pet"
                width={340}
                height={340}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: 64,
                  color: "#9ca3af",
                }}
              >
                🐾
              </div>
            )}
          </div>

          {/* RIGHT: text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: "#6b7280",
                marginBottom: 8,
              }}
            >
              PawCircle · Public Circle
            </div>

            <div
              style={{
                fontSize: 46,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 16,
              }}
            >
              {petName[0].toUpperCase() + petName.slice(1)}
            </div>
            {blurb !== "null" && (
              <div
                style={{
                  fontSize: 24,
                  lineHeight: 1.4,
                  color: "#4b5563",
                  marginBottom: 24,
                  maxWidth: 560,
                }}
              >
                {blurb}
              </div>
            )}
            <div
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                backgroundColor: "#f3e8ff",
                color: "#6d28d9",
                fontSize: 20,
                fontWeight: 600,
                display: "flex", // ⬅️ NOTE: flex, NOT inline-flex
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Build your pet&apos;s village on PawCircle
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
