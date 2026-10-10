import Foundation
import CoreText
import CoreGraphics

// Convert the local system-font wordmark into portable vector outlines.
// Does not copy or redistribute font software.
let fontName = CommandLine.arguments.count > 2 ? CommandLine.arguments[2] : "ArialRoundedMTBold"
let font = CTFontCreateWithName(fontName as CFString, 86, nil)
let attributed = NSAttributedString(string: "InCreditble", attributes: [NSAttributedString.Key(kCTFontAttributeName as String): font])
let line = CTLineCreateWithAttributedString(attributed)
var outlines = ""
func n(_ v: CGFloat) -> String { String(format: "%.3f", Double(v)) }
for run in CTLineGetGlyphRuns(line) as! [CTRun] {
    let count = CTRunGetGlyphCount(run)
    var glyphs = [CGGlyph](repeating: 0, count: count)
    var positions = [CGPoint](repeating: .zero, count: count)
    CTRunGetGlyphs(run, CFRange(location: 0, length: 0), &glyphs)
    CTRunGetPositions(run, CFRange(location: 0, length: 0), &positions)
    for i in 0..<count {
        guard let path = CTFontCreatePathForGlyph(font, glyphs[i], nil) else { continue }
        var d = ""
        path.applyWithBlock { ptr in
            let e = ptr.pointee
            func pt(_ j: Int) -> String { "\(n(e.points[j].x + positions[i].x)) \(n(-e.points[j].y))" }
            switch e.type {
            case .moveToPoint: d += "M\(pt(0))"
            case .addLineToPoint: d += "L\(pt(0))"
            case .addQuadCurveToPoint: d += "Q\(pt(0)) \(pt(1))"
            case .addCurveToPoint: d += "C\(pt(0)) \(pt(1)) \(pt(2))"
            case .closeSubpath: d += "Z"
            @unknown default: break
            }
        }
        outlines += "<path d=\"\(d)\"/>"
    }
}
let payload: [String: Any] = ["paths": outlines, "width": CTLineGetTypographicBounds(line, nil, nil, nil), "font": CTFontCopyPostScriptName(font)]
let data = try JSONSerialization.data(withJSONObject: payload, options: [.prettyPrinted, .sortedKeys])
try data.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))
