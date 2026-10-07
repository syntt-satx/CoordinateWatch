import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def generate_pdf_report(stats: dict, products: list, top_signals: list = None) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    # Theme colors (Butter + Cherry system)
    CHERRY = colors.HexColor('#E94B4B')
    BUTTER = colors.HexColor('#FFE59A')
    DARK_INK = colors.HexColor('#30252A')
    CANVAS = colors.HexColor('#FFFDF4')
    MUTED = colors.HexColor('#756D70')
    BORDER = colors.HexColor('#E9E2D4')
    MINT = colors.HexColor('#79C99A')

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=DARK_INK
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=CHERRY,
        alignment=TA_LEFT
    )
    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=MUTED
    )
    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=DARK_INK,
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK_INK
    )
    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=DARK_INK
    )

    story = []

    # Header section
    story.append(Paragraph("COORDINATEWATCH AI", title_style))
    story.append(Paragraph("SOC 2–ALIGNED ANALYTICAL REPORT • RESTRICTED INTELLIGENCE", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')} | Classification: Trust & Safety Internal", meta_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=CHERRY, spaceBefore=4, spaceAfter=14))

    # Executive Summary Box
    summary_data = [
        [
            Paragraph("<b>Total Reviews Analysed</b><br/><font size=14 color='#30252A'><b>" + f"{stats.get('reviewsAnalysed', 0):,}" + "</b></font>", body_style),
            Paragraph("<b>Products Monitored</b><br/><font size=14 color='#30252A'><b>" + f"{stats.get('productsObserved', 0)}" + "</b></font>", body_style),
            Paragraph("<b>High-Risk Cases</b><br/><font size=14 color='#E94B4B'><b>" + f"{stats.get('highRiskCases', 0)}" + "</b></font>", body_style),
            Paragraph("<b>Platform Risk Index</b><br/><font size=14 color='#30252A'><b>" + f"{stats.get('averageCoordinationRisk', 0)}/100" + "</b></font>", body_style),
        ]
    ]
    summary_table = Table(summary_data, colWidths=[130, 130, 130, 140])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FBF9F2')),
        ('BOX', (0, 0), (-1, -1), 1.5, BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 14))

    # Methodology & Non-Accusatory Disclosure
    story.append(Paragraph("1. Analytical Framework & Principles", h2_style))
    story.append(Paragraph(
        "CoordinateWatch AI evaluates collective multi-agent anomalies across text similarity, temporal velocity, "
        "rating concentration, and reviewer activity patterns. <b>Analytical Notice:</b> The platform identifies "
        "<i>unusual coordination signals</i> and elevated risk rather than definitive user intent. It operates on the core principle: "
        "<i>'Don't judge the review. Investigate the pattern.'</i>",
        body_style
    ))
    story.append(Spacer(1, 10))

    # Signal Breakdown Table
    signal_table_data = [
        [Paragraph("<b>Signal Dimension</b>", body_style), Paragraph("<b>Detection Logic</b>", body_style), Paragraph("<b>Weight</b>", body_style)],
        [Paragraph("Textual Similarity", body_style), Paragraph("TF-IDF Vectorization & Cosine Similarity Clustering for repetitive syntactic phrasing.", body_style), "35%"],
        [Paragraph("Temporal Concentration", body_style), Paragraph("Rolling 48h window z-score deviation identifying abnormal review velocity bursts.", body_style), "30%"],
        [Paragraph("Rating Synchronization", body_style), Paragraph("Polarized 1-star / 5-star distribution skew analysis against product baselines.", body_style), "20%"],
        [Paragraph("Reviewer Behaviour", body_style), Paragraph("Frequency heuristics and extreme-sentiment tendency scoring.", body_style), "15%"]
    ]
    sig_table = Table(signal_table_data, colWidths=[140, 320, 70])
    sig_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BUTTER),
        ('BOX', (0, 0), (-1, -1), 1, BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(sig_table)
    story.append(Spacer(1, 14))

    # Product Watchlist Findings
    story.append(Paragraph("2. Monitored Target Findings & Risk Classification", h2_style))
    prod_table_data = [
        [
            Paragraph("<b>Product Identifier</b>", body_style),
            Paragraph("<b>Reviews</b>", body_style),
            Paragraph("<b>Avg Rating</b>", body_style),
            Paragraph("<b>Risk Score</b>", body_style),
            Paragraph("<b>Classification</b>", body_style)
        ]
    ]

    for p in products:
        risk_color = '#E94B4B' if p.get('overall_risk_level') == 'HIGH' else ('#FFB86B' if p.get('overall_risk_level') == 'MEDIUM' else '#79C99A')
        prod_table_data.append([
            Paragraph(f"<b>{p.get('product_id', 'N/A')}</b>", body_style),
            str(p.get('review_count', 0)),
            f"{p.get('avg_rating', 0):.1f} ★",
            Paragraph(f"<b>{int(p.get('avg_risk_score', 0))}</b>/100", body_style),
            Paragraph(f"<font color='{risk_color}'><b>{p.get('overall_risk_level', 'LOW')}</b></font>", body_style)
        ])

    prod_table = Table(prod_table_data, colWidths=[180, 80, 80, 90, 100])
    prod_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EDE7DB')),
        ('BOX', (0, 0), (-1, -1), 1, BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (3, -1), 'CENTER'),
    ]))
    story.append(prod_table)
    story.append(Spacer(1, 16))

    # SOC 2 Alignment & Compliance Disclaimer
    disclaimer_box = [
        [
            Paragraph(
                "<b>SOC 2 Alignment & Audit Compliance Notice:</b><br/>"
                "This document constitutes an algorithmic audit artifact for Trust, Safety, and Content Integrity teams. "
                "CoordinateWatch AI generates this SOC 2–aligned analytical report to assist compliance reviewers. "
                "This report does not imply formal external SOC 2 certification of third-party platforms.",
                callout_style
            )
        ]
    ]
    disc_table = Table(disclaimer_box, colWidths=[530])
    disc_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F2EFE9')),
        ('BOX', (0, 0), (-1, -1), 1, DARK_INK),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(KeepTogether(disc_table))

    doc.build(story)
    buffer.seek(0)
    return buffer
